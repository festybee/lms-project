import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/api";


function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            logout();
            navigate("/login");
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">LMS Portal</Link>
            </div>
            <div className="navbar-links">
                <Link to="/courses">Courses</Link>

                {/* Student only */}
                {user?.role === "student" && (
                    <Link to="/my-courses">My Courses</Link>
                )}

                {/* Teacher/Admin */}
                {(user?.role === "teacher" || user?.role === "admin") && (
                    <Link to="/manage-courses">Manage Courses</Link>
                )}

                {/* Admin only */}
                {user?.role === "admin" && (
                    <Link to="/users">Users</Link>
                )}
                </div>
            <div className="navbar-user">
                <span>👤 {user?.username} ({user?.role})</span>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;