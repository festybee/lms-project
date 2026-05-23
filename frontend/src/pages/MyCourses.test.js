import { render, screen, waitFor } from '../test-utils';
import { AuthContext } from '../context/AuthContext';
import MyCourses from './MyCourses';
import { getMyCourses } from '../services/api';

jest.mock('../services/api');
jest.mock('../components/Navbar', () => () => <div>Navbar</div>);

const mockEnrollments = [
    {
        id: 1,
        course: {
            id: 1,
            title: 'Python Course',
            description: 'Learn Python',
            created_by: { username: 'teacher1' }
        }
    },
    {
        id: 2,
        course: {
            id: 2,
            title: 'JavaScript Course',
            description: 'Learn JS',
            created_by: { username: 'teacher1' }
        }
    }
];

const renderMyCourses = () => {
    return render(
        <AuthContext.Provider value={{ user: { username: 'student1', role: 'student' }, logout: jest.fn() }}>
            <MyCourses />
        </AuthContext.Provider>
    );
};

describe('MyCourses Page', () => {
    beforeEach(() => {
        getMyCourses.mockClear();
    });

    test('renders page heading', async () => {
        getMyCourses.mockResolvedValue({ data: mockEnrollments });
        renderMyCourses();
        expect(screen.getByText(/my courses/i)).toBeInTheDocument();
    });

    test('renders enrolled courses', async () => {
        getMyCourses.mockResolvedValue({ data: mockEnrollments });
        renderMyCourses();
        await waitFor(() => {
            expect(screen.getByText('Python Course')).toBeInTheDocument();
            expect(screen.getByText('JavaScript Course')).toBeInTheDocument();
        });
    });

    test('shows enrolled badge for each course', async () => {
        getMyCourses.mockResolvedValue({ data: mockEnrollments });
        renderMyCourses();
        await waitFor(() => {
            const badges = screen.getAllByText(/enrolled/i);
            expect(badges.length).toBeGreaterThan(0);
        });
    });

    test('shows loading state initially', () => {
        getMyCourses.mockImplementation(() => new Promise(() => {}));
        renderMyCourses();
        expect(screen.getByText(/loading your courses/i)).toBeInTheDocument();
    });

    test('shows empty message when no enrollments', async () => {
        getMyCourses.mockResolvedValue({ data: [] });
        renderMyCourses();
        await waitFor(() => {
            expect(screen.getByText(/you have not enrolled/i)).toBeInTheDocument();
        });
    });

    test('shows error message on fetch failure', async () => {
        getMyCourses.mockRejectedValue(new Error('Failed'));
        renderMyCourses();
        await waitFor(() => {
            expect(screen.getByText(/failed to load your courses/i)).toBeInTheDocument();
        });
    });
});