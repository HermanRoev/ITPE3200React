import React from "react";
import { Link } from "react-router-dom";

const SidebarMenu = () => {
    return (
        <div className="d-flex flex-column p-3 bg-light" style={{ width: "200px", height: "100vh" }}>
            <h5 className="pb-3">Kage App</h5>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/Profile" className="nav-link">
                        Profile
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SidebarMenu;
