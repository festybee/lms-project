import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/api";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

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
            {/* Brand */}
            <div className="navbar-brand">
                <Link to="/dashboard">LMS Portal</Link>
            </div>

            {/* Desktop links */}
            <div className="navbar-links">
                <Link to="/courses">Courses</Link>
                {user?.role === "student" && (
                    <Link to="/my-courses">My Courses</Link>
                )}
                {(user?.role === "teacher" || user?.role === "admin") && (
                    <Link to="/manage-courses">Manage Courses</Link>
                )}
                {user?.role === "admin" && (
                    <Link to="/users">Users</Link>
                )}
            </div>

            {/* Desktop user info */}
            <div className="navbar-user">
                <span>👤 {user?.username} ({user?.role})</span>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* Hamburger button - mobile only */}
            <button
                className="navbar-hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="navbar-mobile-menu">
                    <Link to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
                    {user?.role === "student" && (
                        <Link to="/my-courses" onClick={() => setMenuOpen(false)}>My Courses</Link>
                    )}
                    {(user?.role === "teacher" || user?.role === "admin") && (
                        <Link to="/manage-courses" onClick={() => setMenuOpen(false)}>Manage Courses</Link>
                    )}
                    {user?.role === "admin" && (
                        <Link to="/users" onClick={() => setMenuOpen(false)}>Users</Link>
                    )}
                    <div className="navbar-mobile-user">
                        <span>👤 {user?.username} ({user?.role})</span>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;