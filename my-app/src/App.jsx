import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';

// import resizeHook from '@hooks/resize';
import styles from './App.css';
// import * as styles from './App.css';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
};

// export { App };
export default App;
