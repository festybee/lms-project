import { useState, useEffect } from 'react';
import { getUsers } from '../services/api';
import Navbar from '../components/Navbar';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

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

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleBadgeClass = (role) => {
        if (role === 'admin') return 'badge badge-admin';
        if (role === 'teacher') return 'badge badge-teacher';
        return 'badge badge-student';
    };

    return (
        <div>
            <Navbar />
            <div className="page-container">
                <div className="page-header-row">
                    <div>
                        <h1>Manage Users</h1>
                        <p>All registered users in the system</p>
                    </div>
                    <div className="user-stats">
                        <span>Total: <strong>{users.length}</strong></span>
                        <span>Students: <strong>{users.filter(u => u.role === 'student').length}</strong></span>
                        <span>Teachers: <strong>{users.filter(u => u.role === 'teacher').length}</strong></span>
                    </div>
                </div>

                {/* Search */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by username, email or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {error && <p className="error">{error}</p>}

                {loading ? (
                    <p className="loading">Loading users...</p>
                ) : filteredUsers.length === 0 ? (
                    <p className="empty">No users found.</p>
                ) : (
                    <div className="users-table-wrapper">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email || '—'}</td>
                                        <td>
                                            <span className={getRoleBadgeClass(user.role)}>
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;