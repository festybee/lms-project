import { render, screen, fireEvent, waitFor } from '../test-utils';
import Register from './Register';
import { registerUser } from '../services/api';

jest.mock('../services/api'); // ← added this for test 

describe('Register Page', () => {

    beforeEach(() => {
        registerUser.mockClear();
    });

    test('renders register form correctly', () => {
        render(<Register />);
        expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    test('renders login link', () => {
        render(<Register />);
        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    test('role dropdown has student and teacher options', () => {
        render(<Register />);
        const select = screen.getByLabelText(/role/i);
        expect(select).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /student/i })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: /teacher/i })).toBeInTheDocument();
    });

    test('shows error when registration fails', async () => {
        registerUser.mockRejectedValueOnce(new Error('Registration failed'));
        render(<Register />);

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'student1' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'pass1234' }
        });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
        });
    });

    test('calls registerUser with correct data', async () => {
        registerUser.mockResolvedValueOnce({ data: {} });
        render(<Register />);

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'student1' }
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'student1@test.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'pass1234' }
        });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith({
                username: 'student1',
                email: 'student1@test.com',
                password: 'pass1234',
                role: 'student'
            });
        });
    });

    test('shows loading state while submitting', async () => {
        registerUser.mockImplementation(() => new Promise(() => {}));
        render(<Register />);

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'student1' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'pass1234' }
        });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /registering/i })).toBeDisabled();
        });
    });
});