import { render, screen, fireEvent, waitFor } from '../test-utils';
import { AuthContext } from '../context/AuthContext';
import ManageCourses from './ManageCourses';
import { getCourses, createCourse, deleteCourse, updateCourse } from '../services/api';

jest.mock('../services/api');
jest.mock('../components/Navbar', () => () => <div>Navbar</div>);


const mockCourses = [
    { id: 1, title: 'Python Course', description: 'Learn Python', created_by: { username: 'teacher1' } },
    { id: 2, title: 'JavaScript Course', description: 'Learn JS', created_by: { username: 'teacher1' } },
];

const renderManageCourses = (role = 'teacher') => {
    return render(
        <AuthContext.Provider value={{ user: { username: 'teacher1', role }, logout: jest.fn() }}>
            <ManageCourses />
        </AuthContext.Provider>
    );
};

describe('ManageCourses Page', () => {
    beforeEach(() => {
        getCourses.mockResolvedValue({ data: mockCourses });
        createCourse.mockResolvedValue({ data: { id: 3, title: 'New Course', description: 'New Desc', created_by: { username: 'teacher1' } } });
        deleteCourse.mockResolvedValue({});
        updateCourse.mockResolvedValue({ data: { id: 1, title: 'Updated Course', description: 'Updated Desc', created_by: { username: 'teacher1' } } });
    });

    test('renders page heading', async () => {
        renderManageCourses();
        expect(screen.getByText(/manage courses/i)).toBeInTheDocument();
    });

    test('renders courses list', async () => {
        renderManageCourses();
        await waitFor(() => {
            expect(screen.getByText('Python Course')).toBeInTheDocument();
            expect(screen.getByText('JavaScript Course')).toBeInTheDocument();
        });
    });

    test('shows new course button', async () => {
        renderManageCourses();
        expect(screen.getByRole('button', { name: /new course/i })).toBeInTheDocument();
    });

    test('shows create form when new course button clicked', async () => {
        renderManageCourses();
        fireEvent.click(screen.getByRole('button', { name: /new course/i }));
        expect(screen.getByText(/create new course/i)).toBeInTheDocument();
    });

    test('creates a new course', async () => {
        renderManageCourses();
        fireEvent.click(screen.getByRole('button', { name: /new course/i }));

        await waitFor(() => {
            fireEvent.change(screen.getByLabelText(/title/i), {
                target: { value: 'New Course' }
            });
            fireEvent.change(screen.getByLabelText(/description/i), {
                target: { value: 'New Desc' }
            });
        });

        fireEvent.click(screen.getByRole('button', { name: /create course/i }));

        await waitFor(() => {
            expect(createCourse).toHaveBeenCalledWith({
                title: 'New Course',
                description: 'New Desc'
            });
        });
    });

    test('shows edit form when edit button clicked', async () => {
        renderManageCourses();
        await waitFor(() => {
            const editButtons = screen.getAllByRole('button', { name: /edit/i });
            fireEvent.click(editButtons[0]);
        });
        expect(screen.getByText(/edit course/i)).toBeInTheDocument();
    });

    test('shows loading state initially', () => {
        getCourses.mockImplementation(() => new Promise(() => {}));
        renderManageCourses();
        expect(screen.getByText(/loading courses/i)).toBeInTheDocument();
    });

    test('shows empty message when no courses', async () => {
        getCourses.mockResolvedValue({ data: [] });
        renderManageCourses();
        await waitFor(() => {
            expect(screen.getByText(/no courses found/i)).toBeInTheDocument();
        });
    });
});