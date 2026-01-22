import React from "react";
import "../styles/Header.css";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Header = ({ user, onLogout }) => {
    const handleLogoutClick = () => {
        onLogout();
    };

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo-text">
                    Eventori.fi
                </Link>
            </div>
            <div className="header-center-wrapper">
                <div className="header-center">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                        end
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/events"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                        end
                    >
                        All Events
                    </NavLink>
                    {/* Only show Add Event if user is logged in */}
                    {user ? (
                        <NavLink
                            to="/events/new"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Add Event
                        </NavLink>
                    ) : (
                        <NavLink to="/login" className="nav-link">
                            Sign in to add event
                        </NavLink>
                    )}
                </div>
            </div>

            <div className="header-right">
                {!user ? (
                    <>
                        <NavLink to="/register" className="nav-link">
                            Register
                        </NavLink>
                        <NavLink to="/login" className="nav-link">
                            Login
                        </NavLink>
                        <ThemeToggle />
                    </>
                ) : (
                    <>
                        <span className="welcome-text">
                            Welcome, {user.name || user.email}!{" "}
                        </span>
                        <button
                            className="logout-button"
                            onClick={handleLogoutClick}
                        >
                            Logout
                        </button>
                        <ThemeToggle />
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
