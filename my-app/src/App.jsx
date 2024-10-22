import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import resizeHook from '@hooks/resize';
import About from './pages/about';
import ProtectedRout from './components/protectedRout';
import { auth } from './firebase';
import Home from './pages/home';
import Private from './pages/private';
import Settings from './pages/settings';
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
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            )}
        </BrowserRouter>
    );
};

// export { App };
export default App;
