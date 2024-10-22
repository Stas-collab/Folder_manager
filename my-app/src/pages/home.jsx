import React, { useState } from 'react';
import styles from '../App.css'; // Використання CSS модуля
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Navigate } from 'react-router-dom';

const Home = ({ user }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSingUpActive, setIsSingUpActive] = useState(true);

    const handleMethodChange = () => {
        setIsSingUpActive(!isSingUpActive);
    };

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSingUp = (event) => {
        event.preventDefault();

        if (!isEmailValid(email)) {
            console.error('Invalid email format');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
            });
    };

    const handleSingIn = (event) => {
        event.preventDefault();

        if (!isEmailValid(email)) {
            console.error('Invalid email format');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
            });
    };

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    if (user) {
        return <Navigate to="/private"></Navigate>;
    }

    return (
        <div className={styles.background}>
            <div className={styles.register}>
                {isSingUpActive ? <h1 data-testid="cypress-titel">Register</h1> : <h1>Login</h1>}
                <form onSubmit={handleSingUp}>
                    <div className={styles.mb3}>
                        <input
                            type="email"
                            className={styles.formControl}
                            placeholder="Email"
                            required
                            onChange={handleEmailChange}
                        />
                        <i className="bx bx-envelope"></i>
                    </div>
                    <div className={styles.mb3}>
                        <input
                            type="password"
                            className={styles.formControl}
                            placeholder="Password"
                            required
                            onChange={handlePasswordChange}
                        />
                        <i className="bx bxs-lock-alt"></i>
                    </div>
                    {isSingUpActive ? (
                        <button type="submit" className={styles.btn}>
                            Create an account
                        </button>
                    ) : (
                        <button type="submit" className={styles.btn} onClick={handleSingIn}>
                            Login
                        </button>
                    )}
                    <a className={styles.link} onClick={handleMethodChange}>
                        {isSingUpActive ? 'Login' : 'Register'}
                    </a>
                </form>
            </div>
        </div>
    );
};

export default Home;
