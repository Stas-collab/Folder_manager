import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { BrowserRouter } from 'react-router-dom';
import Home from './home';
import '@testing-library/jest-dom';
import { auth } from '../firebase';
// Мок функцій Firebase
jest.mock('firebase/auth', () => {
    return {
        getAuth: jest.fn(() => ({})), // Мок для getAuth
        createUserWithEmailAndPassword: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
    };
});

// Загорніть компонент у BrowserRouter для тестування <Navigate>
const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Home component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders registration form by default', () => {
        renderWithRouter(<Home />);
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
    });

    test('toggles between Register and Login forms', () => {
        renderWithRouter(<Home />);
        const toggleLink = screen.getByText(/Login/i);
        fireEvent.click(toggleLink);
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    test('validates email format before submitting', async () => {
        renderWithRouter(<Home />);

        const emailInput = screen.getByPlaceholderText(/Email/i);
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

        const submitButton = screen.getByText(/Create an account/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
        });
    });

    test('calls createUserWithEmailAndPassword on valid signup', async () => {
        renderWithRouter(<Home />);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: 'password123' },
        });

        const submitButton = screen.getByText(/Create an account/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
        });
    });

    test('calls signInWithEmailAndPassword on valid login', async () => {
        renderWithRouter(<Home />);

        // Перемикаємося на форму входу
        fireEvent.click(screen.getByText(/Login/i));

        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: 'password123' },
        });

        const submitButton = screen.getByText(/Login/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
        });
    });

    test('redirects to /private when user is authenticated', () => {
        renderWithRouter(<Home user={{ email: 'test@example.com' }} />);
        expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
    });
});
