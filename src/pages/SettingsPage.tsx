import React from "react";
import {Outlet} from "react-router-dom";
import ManageProfileNav from "../components/ManageProfileNav";
import './SettingsPage.css';
const SettingsPage: React.FC = () => {
    return(
        <div className="container mt-3">
            <h2>Change your account settings</h2>
            <hr/>
            <div className="row gap 3">
                <div className="col-md-3">
                    <ManageProfileNav/>
                </div>
                <div className="col-md-8">
                    {/* Render sub-pages */}
                    <Outlet/>
                </div>
            </div>
        </div>
    )
};

export default SettingsPage;