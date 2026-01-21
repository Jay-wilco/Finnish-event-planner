import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import EventListPage from "./Pages/EventListPage";
import FormPage from "./Pages/FormPage";
import SingleEvent from "./Pages/SingleEvent";
import Register from "./Components/Register";
import Login from "./Components/Login";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";

import "./styles/MainApp.css";

function MainApp() {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const navigate = useNavigate();

    // const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || "";

    // --- User authentication check on mount/refresh ---
    useEffect(() => {
        const checkUser = async () => {
            try {
                await fetch(`/sanctum/csrf-cookie`, {
                    credentials: "include",
                });

                const response = await fetch(`/api/user`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    const userData = await response.json();
                    // Assuming /api/user returns the user object directly (e.g., {id: 1, name: "..."})
                    setUser(userData);
                } else if (response.status === 401) {
                    setUser(null);
                } else {
                    console.error(
                        "Error fetching user:",
                        response.status,
                        await response.text()
                    );
                    setUser(null);
                }
            } catch (error) {
                console.error("Network error when checking user:", error);
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        };

        checkUser();
    }, []);

    // --- CORRECTED handleLoginSuccess and handleRegisterSuccess ---
    const handleLoginSuccess = (userData) => {
        setUser(userData.user); // <-- Reverted to userData.user as per your original working code
        navigate("/");
    };

    const handleRegisterSuccess = (userData) => {
        setUser(userData.user); // <-- Reverted to userData.user as per your original working code
        navigate("/");
    };

    const handleLogout = async () => {
        try {
            await fetch(`/logout`, {
                method: "POST",
                credentials: "include",
            });
            localStorage.removeItem("access_token");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            localStorage.removeItem("access_token");
            setUser(null);
            navigate("/login");
            alert(
                "Logout failed on server, but you have been logged out locally."
            );
        }
    };

    if (loadingUser) {
        return (
            <div className="app-layout">
                <Header user={null} onLogout={() => {}} />
                <main className="app-content">
                    <p>Loading application and user session...</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Header user={user} onLogout={handleLogout} />
            <main className="app-content">
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route
                        path="/events"
                        element={<EventListPage user={user} />}
                    />
                    <Route
                        path="/events/:id"
                        element={<SingleEvent user={user} />}
                    />
                    <Route
                        path="/register"
                        element={
                            <Register
                                user={user}
                                onLogout={handleLogout}
                                onRegisterSuccess={handleRegisterSuccess}
                            />
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <Login
                                onLogin={handleLoginSuccess}
                                user={user}
                                onLogout={handleLogout}
                            />
                        }
                    />

                    {/* Protected Routes Group */}
                    <Route element={<ProtectedRoute user={user} />}>
                        <Route
                            path="/events/new"
                            element={<FormPage user={user} />}
                        />
                        <Route
                            path="/events/:id/edit"
                            element={<FormPage user={user} />}
                        />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default MainApp;
