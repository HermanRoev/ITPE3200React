import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Shared/Navbar';
import SideMenu from './Shared/SideMenu';
import HomePage from './Pages/Home/HomePage';
import LoginMain from './Pages/Authentication/LoginMain';
import LoginPage from './Pages/Authentication/LoginPage';
import RegisterPage from './Pages/Authentication/RegisterPage';
import CreatePost from './Pages/Post/CreatePost';
import SettingsPage from './Pages/Settings/SettingsPage';
import EditPostPage from './Pages/Post/EditPostPage';
import ProfilePage from "./Pages/Profile/ProfilePage";
import SavedPostsPage from "./Pages/Post/SavedPostsPage";

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
                        <Route path="/profile" element={<ProfilePage />} /> {/* Own profile */}
                        <Route path="/profile/:username" element={<ProfilePage />} /> {/* Other profiles */}
                        <Route path="/savedposts" element={<SavedPostsPage />} />
                        <Route path="/createpost" element={<CreatePost />} />
                        <Route path="/settings/*" element={<SettingsPage />} />
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