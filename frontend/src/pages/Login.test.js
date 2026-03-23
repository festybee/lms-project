import { render, screen, fireEvent, waitFor } from '../test-utils';
import Login from './Login';
import { loginUser } from '../services/api';

jest.mock('../services/api'); // ← added this for test

describe('Login Page', () => {

    beforeEach(() => {
        loginUser.mockClear();
    });

    test('renders login form correctly', () => {
        render(<Login />);
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('renders register link', () => {
        render(<Login />);
        expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    });

    test('shows error on invalid credentials', async () => {
        loginUser.mockRejectedValueOnce(new Error('Invalid credentials'));
        render(<Login />);

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'wronguser' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrongpass' }
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
        });
    });

    test('shows loading state while submitting', async () => {
        loginUser.mockImplementation(() => new Promise(() => {}));
        render(<Login />);

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'student1' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'pass1234' }
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
        });
    });

    test('calls loginUser with correct data', async () => {
        loginUser.mockResolvedValueOnce({
            data: {
                token: 'abc123',
                user: { id: 1, username: 'student1', role: 'student' }
            }
        });
        render(<Login />);

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'student1' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'pass1234' }
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith({
                username: 'student1',
                password: 'pass1234'
            });
        });
    });
});