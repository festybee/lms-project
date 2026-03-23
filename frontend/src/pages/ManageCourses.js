import { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function ManageCourses() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await getCourses();
            if (user?.role === 'teacher') {
                setCourses(res.data.filter(c => c.created_by?.username === user?.username));
            } else {
                setCourses(res.data);
            }
        } catch (err) {
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await createCourse(formData);
            setCourses([...courses, res.data]);
            setFormData({ title: '', description: '' });
            setShowForm(false);
            setSuccessMsg('Course created successfully!');
        } catch (err) {
            setError('Failed to create course');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (course) => {
        setEditingCourse(course.id);
        setFormData({ title: course.title, description: course.description });
        setShowForm(false); // close create form if open
        setSuccessMsg('');
        setError('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await updateCourse(editingCourse, formData);
            setCourses(courses.map(c => c.id === editingCourse ? res.data : c));
            setEditingCourse(null);
            setFormData({ title: '', description: '' });
            setSuccessMsg('Course updated successfully!');
        } catch (err) {
            setError('Failed to update course');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingCourse(null);
        setFormData({ title: '', description: '' });
        setError('');
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        setError('');
        setSuccessMsg('');
        try {
            await deleteCourse(courseId);
            setCourses(courses.filter(c => c.id !== courseId));
            setSuccessMsg('Course deleted successfully!');
        } catch (err) {
            setError('Failed to delete course');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="page-container">
                <div className="page-header-row">
                    <div>
                        <h1>Manage Courses</h1>
                        <p>Create and manage your courses</p>
                    </div>
                    {!editingCourse && (
                        <button
                            className="btn-secondary"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Cancel' : '+ New Course'}
                        </button>
                    )}
                </div>

                {/* Create Form */}
                {showForm && !editingCourse && (
                    <div className="form-card">
                        <h3>Create New Course</h3>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Course'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Edit Form */}
                {editingCourse && (
                    <div className="form-card editing">
                        <h3>Edit Course</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {successMsg && <p className="success">{successMsg}</p>}
                {error && <p className="error">{error}</p>}

                {/* Courses List */}
                {loading ? (
                    <p className="loading">Loading courses...</p>
                ) : courses.length === 0 ? (
                    <p className="empty">No courses found. Create your first one!</p>
                ) : (
                    <div className="manage-courses-list">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className={`manage-course-item ${editingCourse === course.id ? 'active' : ''}`}
                            >
                                <div className="manage-course-info">
                                    <h3>{course.title}</h3>
                                    <p>{course.description}</p>
                                    <span className="course-author">
                                        By {course.created_by?.username}
                                    </span>
                                </div>
                                <div className="manage-course-actions">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => handleEditClick(course)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-danger"
                                        onClick={() => handleDelete(course.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageCourses;