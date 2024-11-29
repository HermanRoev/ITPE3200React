import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';
import LoginMain from './pages/LoginMain';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePost from './pages/CreatePost';
import SettingsPage from './pages/SettingsPage';
import ManageProfilePage from './components/ManageProfileNav';
import ChangeEmailPage from './pages/ChangeEmailPage';
import EditPostPage from './pages/EditPostPage';

const App: React.FC = () => {
    const location = useLocation(); // Hook for checking the current route

    // Determine if components should be hidden based on route
    const hideComponents = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/welcome';

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Conditionally render Navbar and SideMenu */}
                {!hideComponents && <Navbar />}
                {!hideComponents && (
                    <div className="col-lg-3 d-none d-lg-block p-0" id="sidemenu">
                        <SideMenu />
                    </div>
                )}
                <div className={`col-lg-9 ${hideComponents ? 'w-100' : ''}`}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/welcome" element={<LoginMain />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/createpost" element={<CreatePost />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/change-email" element={<ChangeEmailPage />}></Route>
                        <Route path="/post/edit/:postId" element={<EditPostPage />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

// Wrap App component with Router
const AppWrapper: React.FC = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;