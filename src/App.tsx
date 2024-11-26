import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-3 d-none d-lg-block">
                        <SideMenu />
                    </div>
                    <div className="col-lg-9">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;