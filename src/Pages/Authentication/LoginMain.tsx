import React from 'react';
import './LoginMain.css';
import {Link} from "react-router-dom";
import WelcomeVector from '../../assets/images/kage_welcome_vector.png';

const LoginMain: React.FC = () => {
    return (
        <>

            <div className="container">
            <Link
                to="/"
                className="btn-close btn-close-white"
                aria-label="Close"
                style={{ position: "absolute", top: "2rem", left: "2rem", fontSize: "1.8rem" }}
            ></Link>
                <div
                    className="row vh-100 justify-content-center align-items-center"
                    style={{paddingBottom: "5em"}}
                >
                    <div className="col-md-8 text-center">
                        <img
                            src={WelcomeVector}
                            alt="Vector Illustration"
                            className="img-fluid my-2"
                            style={{height: "26rem"}}/>
                        <h2 className="mb-3" style={{color: "#76b5e0"}}>
                            Share Your World, Discover Others
                        </h2>
                        <p className="lead mb-4">
                            Dive into a universe of images and ideas, where your creativity brings us together
                        </p>
                        <div className="mt-3 text-center">
                            <Link
                                to="/login"
                                className="btn btn-lg me-1 px-4 py-2 loginbtn-primary"
                                role="button"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-lg ms-1 px-4 py-2 loginbtn-secondary"
                                role="button"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginMain;