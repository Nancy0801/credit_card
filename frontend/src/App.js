import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TransactionPage from './TransactionPage';
import Login from './Login';
import Register from './Register';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/transaction" element={<TransactionPage />} />
            </Routes>
        </Router>
    );
};

export default App;
