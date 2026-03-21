import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";


function Dashboard() {

    const { user } = useAuth();

    const studentLinks = [
        { to: "/courses", label: "📚 Browse Courses" },
        { to: "/my-courses", label: "🎓 My Enrolled Courses" },
    ];

    const teacherLinks = [
        { to: "/courses", label: "📚 Browse Courses" },
        { to: "/manage-courses", label: "🎛️ Manage Courses" },
    ];

    const adminLinks = [
        { to: "/courses", label: "📚 Browse Courses" },
        { to: "/manage-courses", label: "✏️ Manage Courses" },
        { to: "/users", label: "👥 Manage Users" },
    ];
    
    const getLinks = () => {
        if (user?.role === "student") return studentLinks;
        if (user?.role === "teacher") return teacherLinks;
        if (user?.role === "admin") return adminLinks;
        return [];
    };

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Welcome, {user?.username}! 👋</h1>
                    <p>You are logged in as <strong>{user?.role}</strong></p>
                </div>
                <div className="dashboard-cards">
                    {getLinks().map((link) => (
                        <Link key={link.to} to={link.to} className="dashboard-card">
                            {link.label}
                        </Link>
                    ))}
                </div>
             </div>
        </div>
    );
}



export default Dashboard;