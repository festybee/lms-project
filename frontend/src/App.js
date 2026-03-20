import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages to be created
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import MyCourse from './pages/MyCourse';
import ManageCourses from './pages/ManageCourses';
import Users from './pages/Users';


// Protected route wrapper
const ProtectedRoute = ({ children, roles }) => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" />;
    }
    return children;
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route  path="/login" element={<Login />} />
          <Route  path="/register" element={<Register />} />

          {/* Protected - all roles */}
          <Route  path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route  path="/courses" element={
            <ProtectedRoute>
              <Course />
            </ProtectedRoute>
          } />

           {/* Protected - student only */}
           <Route  path="/my-courses" element={
            <ProtectedRoute roles={['student']}>
              <MyCourse />
            </ProtectedRoute>
          } />

           {/* Protected - teacher/admin */}
           <Route  path="/manage-courses" element={
            <ProtectedRoute roles={['teacher', 'admin']}>
              <ManageCourses />
            </ProtectedRoute>
          } />

            {/* Protected - admin only */}
           <Route  path="/users" element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          } />

            {/* Default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
