import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCourses, enrollCourse, getMyCourses } from '../services/api';
import Navbar from '../components/Navbar';

function Courses() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrolling, setEnrolling] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesRes = await getCourses();
                setCourses(coursesRes.data);

                if (user?.role === 'student') {
                    const myCoursesRes = await getMyCourses();
                    const ids = myCoursesRes.data.map((e) => e.course.id);
                    setEnrolledIds(ids);
                }
            } catch (err) {
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.role]);
 

    const handleEnroll = async (courseId) => {
        setEnrolling(courseId);
        setSuccessMsg('');
        setError('');
        try {
            await enrollCourse(courseId);
            setEnrolledIds([...enrolledIds, courseId]); // update locally
            setSuccessMsg('Successfully enrolled!');
        } catch (err) {
            setError('Enrollment failed. Please try again.');
        } finally {
            setEnrolling(null);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="page-container">
                <div className="page-header">
                    <h1>Available Courses</h1>
                    <p>Browse and enroll in courses below</p>
                </div>

                {successMsg && <p className="success">{successMsg}</p>}
                {error && <p className="error">{error}</p>}

                {loading ? (
                    <p className="loading">Loading courses...</p>
                ) : courses.length === 0 ? (
                    <p className="empty">No courses available yet.</p>
                ) : (
                    <div className="courses-grid">
                        {courses.map((course) => (
                            <div key={course.id} className="course-card">
                                <div className="course-card-body">
                                    <h3>{course.title}</h3>
                                    <p>{course.description}</p>
                                    <span className="course-author">
                                        By {course.created_by?.username}
                                    </span>
                                </div>
                                <div className="course-card-footer">
                                    {user?.role === 'student' && (
                                        enrolledIds.includes(course.id) ? (
                                            <span className="course-badge enrolled">
                                                ✅ Already Enrolled
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleEnroll(course.id)}
                                                disabled={enrolling === course.id}
                                            >
                                                {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
                                            </button>
                                        )
                                    )}
                                    {(user?.role === 'teacher' || user?.role === 'admin') && (
                                        <span className="course-badge">
                                            {course.created_by?.username === user?.username
                                                ? 'Your Course'
                                                : 'View Only'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Courses;