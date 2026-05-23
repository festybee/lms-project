import { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../services/api';
import Navbar from '../components/Navbar';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', role: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsers();
                setUsers(res.data);
            } catch (err) {
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleEditClick = (user) => {
        setEditingUser(user.id);
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role
        });
        setSuccessMsg('');
        setError('');
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setFormData({ username: '', email: '', role: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await updateUser(editingUser, formData);
            setUsers(users.map(u => u.id === editingUser ? res.data : u));
            setEditingUser(null);
            setFormData({ username: '', email: '', role: '' });
            setSuccessMsg('User updated successfully!');
        } catch (err) {
            setError('Failed to update user');
        } finally {
            setSubmitting(false);
        }
    };

    const getRoleBadgeClass = (role) => {
        if (role === 'admin') return 'badge badge-admin';
        if (role === 'teacher') return 'badge badge-teacher';
        return 'badge badge-student';
    };

    return (
        <div>
            <Navbar />
            <div className="page-container">
                {/* Header */}
                <div className="page-header-row">
                    <div>
                        <h1>Manage Users</h1>
                        <p>View and edit all registered users</p>
                    </div>
                    <div className="user-stats">
                        <span>Total: <strong>{users.length}</strong></span>
                        <span>Students: <strong>{users.filter(u => u.role === 'student').length}</strong></span>
                        <span>Teachers: <strong>{users.filter(u => u.role === 'teacher').length}</strong></span>
                    </div>
                </div>

                {/* Edit Form */}
                {editingUser && (
                    <div className="form-card editing">
                        <h3>Edit User</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
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

                {/* Messages */}
                {successMsg && <p className="success">{successMsg}</p>}
                {error && <p className="error">{error}</p>}

                {/* Search */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by username, email or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <p className="loading">Loading users...</p>
                ) : filteredUsers.length === 0 ? (
                    <p className="empty">No users found.</p>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="users-table-wrapper">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={user.id} className={editingUser === user.id ? 'active-row' : ''}>
                                            <td>{index + 1}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email || '—'}</td>
                                            <td>
                                                <span className={getRoleBadgeClass(user.role)}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => handleEditClick(user)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="users-mobile-list">
                            {filteredUsers.map((user, index) => (
                                <div key={user.id} className="user-mobile-card">
                                    <div className="user-mobile-info">
                                        <p><strong>#{index + 1} {user.username}</strong></p>
                                        <p>{user.email || '—'}</p>
                                        <span className={getRoleBadgeClass(user.role)}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => handleEditClick(user)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Users;