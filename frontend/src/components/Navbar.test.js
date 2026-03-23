import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';

jest.mock('../services/api'); // ← add this for test

const renderNavbar = (user) => {
    return render(
        <AuthContext.Provider value={{ user, logout: jest.fn() }}>
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

describe('Navbar', () => {

    test('renders brand name', () => {
        renderNavbar({ username: 'student1', role: 'student' });
        expect(screen.getByText(/lms portal/i)).toBeInTheDocument();
    });

    test('shows My Courses link for students', () => {
        renderNavbar({ username: 'student1', role: 'student' });
        expect(screen.getByRole('link', { name: /my courses/i })).toBeInTheDocument();
    });

    test('does not show My Courses link for teachers', () => {
        renderNavbar({ username: 'teacher1', role: 'teacher' });
        expect(screen.queryByRole('link', { name: /my courses/i })).not.toBeInTheDocument();
    });

    test('shows Manage Courses link for teachers', () => {
        renderNavbar({ username: 'teacher1', role: 'teacher' });
        expect(screen.getByRole('link', { name: /manage courses/i })).toBeInTheDocument();
    });

    test('shows Manage Courses link for admins', () => {
        renderNavbar({ username: 'admin1', role: 'admin' });
        expect(screen.getByRole('link', { name: /manage courses/i })).toBeInTheDocument();
    });

    test('shows Users link for admins only', () => {
        renderNavbar({ username: 'admin1', role: 'admin' });
        expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument();
    });

    test('does not show Users link for students', () => {
        renderNavbar({ username: 'student1', role: 'student' });
        expect(screen.queryByRole('link', { name: /users/i })).not.toBeInTheDocument();
    });

    test('shows logout button', () => {
        renderNavbar({ username: 'student1', role: 'student' });
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test('shows username in navbar', () => {
        renderNavbar({ username: 'student1', role: 'student' });
        expect(screen.getByText(/student1/i)).toBeInTheDocument();
    });
});

