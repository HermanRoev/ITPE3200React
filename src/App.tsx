import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import SidebarMenu from "./components/SidebarMenu";
import HomePage from "./pages/HomePage";
import PostComponentTest from "./components/PostComponentTest";

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
                    </Routes>
                    <PostComponentTest />
                </Container>
            </div>
        </Router>
    );
}

export default App;
