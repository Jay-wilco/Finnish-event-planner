import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.css";
import { FaLock, FaEnvelope, FaUser, FaCheck } from "react-icons/fa";

function Register({ user, onLogout, onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch("/register", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setMessage(data.message || "Registration successful!");

                onRegisterSuccess(data);
            } else {
                const errorData = await res.json();
                setMessage(errorData.message || "Registration failed.");
                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors)
                        .flat()
                        .join(" ");
                    setMessage((prev) => prev + " " + errorMessages);
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("An error occurred during registration. Try again.");
        }
    };

    if (user) {
        return (
            <div className="logged-in-message">
                <h2>You are already logged in!</h2>
                <p>Welcome back, {user.name || user.email}.</p>
                <button onClick={onLogout} className="logout-button">
                    Logout
                </button>
                <Link to="/" className="home-link">
                    Go to Home Page
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Register</h2>
            <div className="form-group">
                <input
                    type="text"
                    name="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <label>
                    <FaUser style={{ marginRight: "6px" }} />
                    Name
                </label>
            </div>

            <div className="form-group">
                <input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label>
                    <FaEnvelope style={{ marginRight: "6px" }} />
                    Email
                </label>
            </div>

            <div className="form-group">
                <input
                    type="password"
                    name="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <label>
                    <FaLock style={{ marginRight: "6px" }} />
                    Password
                </label>
            </div>

            <div className="form-group">
                <input
                    type="password"
                    name="password_confirmation"
                    placeholder=" "
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                />
                <label>
                    <FaCheck style={{ marginRight: "6px" }} />
                    Confirm Password
                </label>
            </div>
            <button type="submit">Register</button>

            {message && (
                <p
                    className={`register-message ${
                        message.includes("successful") ? "success" : "error"
                    }`}
                >
                    {message}
                </p>
            )}
        </form>
    );
}

export default Register;
