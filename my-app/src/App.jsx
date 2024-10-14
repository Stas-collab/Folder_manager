import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Private from './pages/private';
import Home from './pages/home';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from './firebase';

import ProtectedRout from './components/protectedRout';

// import resizeHook from '@hooks/resize';
import styles from './App.css';
// import * as styles from './App.css';

const App = () => {
    const [user, setUser] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setIsFetching(false);
                return;
            }

            setUser(null);
            setIsFetching(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <BrowserRouter>
            {isFetching ? (
                <h1>Loading...</h1>
            ) : (
                <Routes>
                    <Route index path="/" element={<Home user={user} />} />
                    <Route
                        path="/private"
                        element={
                            <ProtectedRout user={user}>
                                <Private />
                            </ProtectedRout>
                        }
                    />
                </Routes>
            )}
        </BrowserRouter>
    );
};

// export { App };
export default App;
