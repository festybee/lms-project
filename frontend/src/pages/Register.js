import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";


function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "", role: "student", role: "student" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await registerUser(formData);
            navigate("/login");
        } catch (err) {
            setError('Registration failed. Username may already exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Register</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
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
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}

export default Register;