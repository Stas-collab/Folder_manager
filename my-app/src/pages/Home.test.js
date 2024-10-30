import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { BrowserRouter } from 'react-router-dom';
import Home from './home';
import { signOut } from 'firebase/auth';
import DefaultImage from '../image/default.jpg';
import Private from './private';
import Settings from './settings';
import '@testing-library/jest-dom';
import { auth } from '../firebase';
import { getDoc, setDoc } from 'firebase/firestore';
// Мок функцій Firebase
jest.mock('firebase/auth', () => {
    return {
        getAuth: jest.fn(() => ({})), // Мок для getAuth
        createUserWithEmailAndPassword: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
    };
});

jest.mock('firebase/firestore', () => {
    return {
        getFirestore: jest.fn(() => ({})),
        addDoc: jest.fn(),
        collection: jest.fn(),
        deleteDoc: jest.fn(),
        doc: jest.fn(),
        getDoc: jest.fn(),
        getDocs: jest.fn(),
        query: jest.fn(),
        where: jest.fn(),
        setDoc: jest.fn(),
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
        expect(screen.getByText(/Register/i)).toBeInTheDocument();

        const toggleLink = screen.getByText(/Login/i);
        fireEvent.click(toggleLink);

        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.queryByText(/Create an account/i)).not.toBeInTheDocument();
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

describe('Private component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('creates a folder successfully', async () => {
        render(<Private />);

        fireEvent.change(screen.getByPlaceholderText(/Folder name/i), { target: { value: 'New Folder' } });
        fireEvent.change(screen.getByDisplayValue(/#ffffff/i), { target: { value: '#ff0000' } }); // Вибір червоного кольору

        addDoc.mockResolvedValueOnce({ id: 'folderId' });

        const createButton = screen.getByText(/Create folder/i);
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
                name: 'New Folder',
                color: '#ff0000',
                userId: expect.any(String),
            });
        });
    });
});

describe('Settings component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        auth.currentUser = { uid: 'testUserId' };
        getDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({ avatarUrl: 'http://example.com/avatar.jpg' }),
        });
    });

    test('renders the settings component and displays the avatar', async () => {
        renderWithRouter(<Settings />);
        expect(await screen.findByAltText('Avatar')).toHaveAttribute('src', 'http://example.com/avatar.jpg');
    });

    test('calls signOut when logout button is clicked', async () => {
        renderWithRouter(<Settings />);
        const logoutButton = screen.getByText(/logout/i);
        fireEvent.click(logoutButton);
        expect(signOut).toHaveBeenCalled();
    });

    test('handles image upload', async () => {
        const file = new File(['test'], 'test.png', { type: 'image/png' });

        renderWithRouter(<Settings />);

        const input = screen.getByTestId('file-input');

        Object.defineProperty(input, 'files', {
            value: [file],
        });
        fireEvent.change(input);

        await waitFor(() => {
            expect(setDoc).toHaveBeenCalledWith(
                expect.anything(),
                {
                    avatarUrl: expect.any(String),
                },
                { merge: true },
            );
        });
    });
});
