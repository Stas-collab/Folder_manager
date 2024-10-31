import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthProvider } from '../components/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import Home from './home';
import About from './about';
import { signOut } from 'firebase/auth';
import DefaultImage from '../image/default.jpg';
import { MemoryRouter } from 'react-router-dom';
import Private from './private';
import Settings from './settings';
import '@testing-library/jest-dom';
import { auth } from '../firebase';
import { getDoc, setDoc } from 'firebase/firestore';
// Мок функцій Firebase
jest.mock('firebase/auth', () => {
    return {
        getAuth: jest.fn(() => ({})), // Мок для getAuth
        signOut: jest.fn(() => Promise.resolve()),
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
        render(<Home user={null} />);

        const toggleLink = screen.getByText(/Login/i);

        fireEvent.click(toggleLink);

        const loginTitle = screen.getByRole('heading', { name: /Login/i });
        expect(loginTitle).toBeInTheDocument();

        const loginButton = screen.getByRole('button', { name: /Login/i });
        expect(loginButton).toBeInTheDocument();

        expect(screen.getByText(/Register/i)).toBeInTheDocument();
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
        createUserWithEmailAndPassword.mockResolvedValueOnce({
            user: { uid: '12345', email: 'test@example.com' },
        });

        render(<Home user={null} />);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Create an account/i }));

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
    });

    test('should call signInWithEmailAndPassword on sign in', async () => {
        signInWithEmailAndPassword.mockResolvedValueOnce({ user: { email: 'test@example.com' } });

        render(<Home user={null} />);

        fireEvent.click(screen.getByText('Login'));

        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

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
        const mockUser = { uid: 'testUserId' };
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: mockUser }}>
                    <Private />
                </AuthContext.Provider>
            </MemoryRouter>,
        );

        fireEvent.change(screen.getByPlaceholderText(/Folder name/i), { target: { value: 'New Folder' } });
        fireEvent.change(screen.getByDisplayValue(/#ffffff/i), { target: { value: '#ff0000' } });

        addDoc.mockResolvedValueOnce({ id: 'folderId' });

        const createButton = screen.getByText(/Create folder/i);
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
                name: 'New Folder',
                color: '#ff0000',
                userId: 'testUserId',
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

describe('About Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders About component with user avatar', async () => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>,
        );

        const aboutHeadings = screen.getAllByText(/About us/i);
        expect(aboutHeadings).toHaveLength(2);
        expect(aboutHeadings[0]).toBeInTheDocument();
    });

    test('handles sign out', async () => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>,
        );

        const signOutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(signOutButton);

        expect(signOut).toHaveBeenCalledWith(auth);
    });

    test('does not render user avatar if not available', async () => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>,
        );

        const avatarImg = await screen.findByAltText('');
        expect(avatarImg).toHaveAttribute('src', DefaultImage);
    });
});
