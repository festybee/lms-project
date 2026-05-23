import { render, screen, fireEvent, waitFor } from '../test-utils';
import { AuthContext } from '../context/AuthContext';
import Courses from './Courses';
import { getCourses, getMyCourses, enrollCourse } from '../services/api';

jest.mock('../services/api');
jest.mock('../components/Navbar', () => () => <div>Navbar</div>);

const mockCourses = [
    { id: 1, title: 'Python Course', description: 'Learn Python', created_by: { username: 'teacher1' } },
    { id: 2, title: 'JavaScript Course', description: 'Learn JS', created_by: { username: 'teacher1' } },
];

const renderCourses = (role) => {
    return render(
        <AuthContext.Provider value={{ user: { username: 'testuser', role }, logout: jest.fn() }}>
            <Courses />
        </AuthContext.Provider>
    );
};

describe('Courses Page', () => {
    beforeEach(() => {
        getCourses.mockResolvedValue({ data: mockCourses });
        getMyCourses.mockResolvedValue({ data: [] });
        enrollCourse.mockResolvedValue({ data: {} });
    });

    test('renders courses list', async () => {
        renderCourses('student');
        await waitFor(() => {
            expect(screen.getByText('Python Course')).toBeInTheDocument();
            expect(screen.getByText('JavaScript Course')).toBeInTheDocument();
        });
    });

    test('shows enroll button for students', async () => {
        renderCourses('student');
        await waitFor(() => {
            const enrollButtons = screen.getAllByRole('button', { name: /enroll/i });
            expect(enrollButtons.length).toBe(2);
        });
    });

    test('shows already enrolled badge for enrolled courses', async () => {
        getMyCourses.mockResolvedValue({
            data: [{ id: 1, course: { id: 1, title: 'Python Course', created_by: { username: 'teacher1' } } }]
        });
        renderCourses('student');
        await waitFor(() => {
            expect(screen.getByText(/already enrolled/i)).toBeInTheDocument();
        });
    });

    test('shows loading state initially', () => {
        getCourses.mockImplementation(() => new Promise(() => {}));
        renderCourses('student');
        expect(screen.getByText(/loading courses/i)).toBeInTheDocument();
    });

    test('shows empty message when no courses', async () => {
        getCourses.mockResolvedValue({ data: [] });
        renderCourses('student');
        await waitFor(() => {
            expect(screen.getByText(/no courses available/i)).toBeInTheDocument();
        });
    });

    test('shows view only badge for teachers', async () => {
        renderCourses('teacher');
        await waitFor(() => {
            const badges = screen.getAllByText(/view only/i);
            expect(badges.length).toBeGreaterThan(0);
        });
    });

    test('calls enrollCourse when enroll button clicked', async () => {
        renderCourses('student');
        await waitFor(() => {
            const enrollButtons = screen.getAllByRole('button', { name: /enroll/i });
            fireEvent.click(enrollButtons[0]);
        });
        await waitFor(() => {
            expect(enrollCourse).toHaveBeenCalledWith(1);
        });
    });

    test('shows success message after enrollment', async () => {
        renderCourses('student');
        await waitFor(() => {
            const enrollButtons = screen.getAllByRole('button', { name: /enroll/i });
            fireEvent.click(enrollButtons[0]);
        });
        await waitFor(() => {
            expect(screen.getByText(/successfully enrolled/i)).toBeInTheDocument();
        });
    });
});