from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Course, Enrollment


class AuthTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')

    def test_register_student(self):
        res = self.client.post(self.register_url, {
            'username': 'student1',
            'password': 'pass1234',
            'email': 'student1@test.com',
            'role': 'student'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['role'], 'student')

    def test_register_teacher(self):
        res = self.client.post(self.register_url, {
            'username': 'teacher1',
            'password': 'pass1234',
            'email': 'teacher1@test.com',
            'role': 'teacher'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['role'], 'teacher')

    def test_login_valid_credentials(self):
        User.objects.create_user(
            username='student1',
            password='pass1234',
            role='student'
        )
        res = self.client.post(self.login_url, {
            'username': 'student1',
            'password': 'pass1234'
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('token', res.data)

    def test_login_invalid_credentials(self):
        res = self.client.post(self.login_url, {
            'username': 'nobody',
            'password': 'wrongpass'
        })
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class CourseTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        # Create users
        self.student = User.objects.create_user(
            username='student1',
            password='pass1234',
            role='student'
        )
        self.teacher = User.objects.create_user(
            username='teacher1',
            password='pass1234',
            role='teacher'
        )
        self.admin = User.objects.create_user(
            username='admin1',
            password='pass1234',
            role='admin'
        )

        # Create a course
        self.course = Course.objects.create(
            title='Test Course',
            description='Test Description',
            created_by=self.teacher
        )

        self.courses_url = reverse('course-list')

    def test_anyone_can_list_courses(self):
        res = self.client.get(self.courses_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_teacher_can_create_course(self):
        self.client.force_authenticate(user=self.teacher)
        res = self.client.post(self.courses_url, {
            'title': 'New Course',
            'description': 'New Description'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['title'], 'New Course')

    def test_student_cannot_create_course(self):
        self.client.force_authenticate(user=self.student)
        res = self.client.post(self.courses_url, {
            'title': 'New Course',
            'description': 'New Description'
        })
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_create_course(self):
        res = self.client.post(self.courses_url, {
            'title': 'New Course',
            'description': 'New Description'
        })
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_teacher_can_delete_own_course(self):
        self.client.force_authenticate(user=self.teacher)
        url = reverse('course-detail', args=[self.course.id])
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_admin_can_delete_any_course(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('course-detail', args=[self.course.id])
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_student_cannot_delete_course(self):
        self.client.force_authenticate(user=self.student)
        url = reverse('course-detail', args=[self.course.id])
        res = self.client.delete(url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


class EnrollmentTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.student = User.objects.create_user(
            username='student1',
            password='pass1234',
            role='student'
        )
        self.teacher = User.objects.create_user(
            username='teacher1',
            password='pass1234',
            role='teacher'
        )
        self.course = Course.objects.create(
            title='Test Course',
            description='Test Description',
            created_by=self.teacher
        )

        self.enroll_url = reverse('enroll')
        self.my_courses_url = reverse('my-courses')

    def test_student_can_enroll(self):
        self.client.force_authenticate(user=self.student)
        res = self.client.post(self.enroll_url, {
            'course_id': self.course.id
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_student_cannot_enroll_twice(self):
        self.client.force_authenticate(user=self.student)
        self.client.post(self.enroll_url, {'course_id': self.course.id})
        res = self.client.post(self.enroll_url, {'course_id': self.course.id})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthenticated_cannot_enroll(self):
        res = self.client.post(self.enroll_url, {
            'course_id': self.course.id
        })
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_can_view_my_courses(self):
        Enrollment.objects.create(student=self.student, course=self.course)
        self.client.force_authenticate(user=self.student)
        res = self.client.get(self.my_courses_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    def test_unauthenticated_cannot_view_my_courses(self):
        res = self.client.get(self.my_courses_url)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)