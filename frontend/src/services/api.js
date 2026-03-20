import axios from 'axios';


const API = axios.create({
    baseURL: 'http://localhost:8000/api',
});


// Attach token to every request if it exists
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register/', data);
export const loginUser = (data) => API.post('/auth/login/', data);
export const logoutUser = () => API.post('/auth/logout/');

// Courses
export const getCourses = () => API.get('/courses/');
export const getCourse = (id) => API.get(`/courses/${id}/`);
export const createCourse = (data) => API.post('/courses/', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}/`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}/`);

// Enrollments
export const enrollCourse = (courseId) => API.post(`/enroll/`, { course_id });
export const getMyCourses = () => API.get('/my-courses/');

// Admin
export const getUsers = () => API.get('/users/');
