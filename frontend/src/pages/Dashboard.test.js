import { render, screen } from '../test-utils';
import { AuthContext } from '../context/AuthContext';
import Dashboard from './Dashboard';

jest.mock('../services/api');
jest.mock('../components/Navbar', () => () => <div>Navbar</div>);

const renderDashboard = (role) => {
    return render(
        <AuthContext.Provider value={{ user: { username: 'testuser', role }, logout: jest.fn() }}>
            <Dashboard />
        </AuthContext.Provider>
    );
};

describe('Dashboard Page', () => {
    test('renders welcome message', () => {
        renderDashboard('student');
        expect(screen.getByText(/welcome,/i)).toBeInTheDocument();
    });

    test('shows student links for student role', () => {
        renderDashboard('student');
        expect(screen.getByText(/Browse Courses/i)).toBeInTheDocument();
        expect(screen.getByText(/My Enrolled Courses/i)).toBeInTheDocument();
    });

    test('shows teacher links for teacher role', () => {
        renderDashboard('teacher');
        expect(screen.getByText(/Browse Courses/i)).toBeInTheDocument();
        expect(screen.getByText(/Manage Courses/i)).toBeInTheDocument();
    });

    test('shows admin links for admin role', () => {
        renderDashboard('admin');
        expect(screen.getByText(/Browse Courses/i)).toBeInTheDocument();
        expect(screen.getByText(/Manage Courses/i)).toBeInTheDocument();
        expect(screen.getByText(/Manage Users/i)).toBeInTheDocument();
    });

    test('does not show My Enrolled Courses for teacher', () => {
        renderDashboard('teacher');
        expect(screen.queryByText(/My Enrolled Courses/i)).not.toBeInTheDocument();
    });

    test('shows correct role in welcome message', () => {
        renderDashboard('admin');
        expect(screen.getByText(/admin/i)).toBeInTheDocument();
    });
});