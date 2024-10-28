import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRout from './components/protectedRout';

import useAuth from './hooks/useAuth';
// import resizeHook from '@hooks/resize';
import About from './pages/about';
import Home from './pages/home';
import Private from './pages/private';
import Settings from './pages/settings';
// import * as styles from './App.css';

const App = () => {
    const { user, isFetching } = useAuth();
    if (isFetching) {
        return <h1>Loading...</h1>;
    }
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
};

// export { App };
export default App;
