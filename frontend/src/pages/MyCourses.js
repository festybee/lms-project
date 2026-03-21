import { useState, useEffect } from "react";
import { getMyCourses } from "../services/api";
import Navbar from "../components/Navbar";


function MyCourses() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const res = await getMyCourses();
            setEnrollments(res.data);
        } catch (err) {
            setError("Failed to load your courses.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div>
        <Navbar />
        <div className="page-container">
            <div className="page-header">
                <h1>My Courses</h1>
                <p>Courses you are enrolled in</p>
            </div>

            {error && <p className="error">{error}</p>}

            {loading ? (
                <p className="loading">Loading your courses...</p> 
            ) : enrollments.length === 0 ? (
                <p className="empty">You have not enrolled in any courses yet.</p>
            ) : (
                <div className="courses-grid">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="course-card">
                            <div className="course-card-body">
                                <h3>{enrollment.course.title}</h3>
                                <p>{enrollment.course.description}</p>
                                 <span className="course-author">
                                    by {enrollment.course.created_by?.username}
                                 </span>
                            </div>
                            <div className="course-card-footer">
                                <span className="ecourse-badge enrolled">
                                    ✅ Enrolled
                                </span>
                            </div>
                         </div>
                    ))}
                </div>
                )}
        </div>
    </div>
);
}

export default MyCourses;