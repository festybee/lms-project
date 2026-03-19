from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .views import (
    RegisterView, LoginView, LogoutView, CourseListCreateView,
    CourseDetailView, EnrollView, MyCoursesView, UserListView
)


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'register': reverse('register', request=request, format=format),
        'login': reverse('login', request=request, format=format),
        'logout': reverse('logout', request=request, format=format),
        'courses': reverse('course-list', request=request, format=format),
        'enroll': reverse('enroll', request=request, format=format),
        'my-courses': reverse('my-courses', request=request, format=format),
        'users': reverse('user-list', request=request, format=format),
    })


urlpatterns = [
    # Root
    path('', api_root, name='api-root'),

    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),

    # Courses
    path('courses/', CourseListCreateView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),

    # Enrollments
    path('enroll/', EnrollView.as_view(), name='enroll'),
    path('my-courses/', MyCoursesView.as_view(), name='my-courses'),

    # Admin
    path('users/', UserListView.as_view(), name='user-list'),
]