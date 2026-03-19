from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, CourseListCreateView,
    CourseDetailView, EnrollView, MyCoursesView, UserListView
)


urlpatterns = [
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