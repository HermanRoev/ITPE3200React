import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import HomePage from "./Home/Index";
import ProfilePage from "./Profile/Profile";
import SidebarMenu from "./shared/SidebarMenu";

function App() {
    return (
        <Router>
            <div className="d-flex">
                {/* Sidebar Menu */}
                <SidebarMenu />

                {/* Main Content */}
                <Container className="flex-grow-1 p-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/Profile" element={<ProfilePage />} />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default App;
