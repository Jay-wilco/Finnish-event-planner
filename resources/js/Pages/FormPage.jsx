import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventForm from "../Components/Events/EventForm";
import "../styles/FormPage.css";

const FormPage = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

    const [eventData, setEventData] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        category: "",
        description: "",
        image_url: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            fetchEventForEdit(id);
        } else {
            setIsEditing(false);
            setEventData({
                title: "",
                date: "",
                time: "",
                location: "",
                category: "",
                description: "",
                image_url: "",
            });
        }
    }, [id]);

    const fetchEventForEdit = async (eventId) => {
        try {
            const res = await fetch(`/api/events/${eventId}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setEventData(data);
        } catch (error) {
            console.error("Error fetching event for edit:", error);
            alert("Failed to load event for editing. Please try again.");
            navigate("/events");
        }
    };

    const handleInputChange = (e) => {
        setEventData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing ? `/api/events/${id}` : `/api/events`;
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventData),
                credentials: "include",
            });

            if (res.ok) {
                alert(
                    `Event ${isEditing ? "updated" : "created"} successfully!`
                );
                navigate("/events");
            } else {
                const errorText = await res.text();
                console.error(`Failed to submit event:`, res.status, errorText);
                alert(`Failed to ${isEditing ? "update" : "create"} event.`);
            }
        } catch (error) {
            console.error("Network or submission error:", error);
            alert("An error occurred during submission. Please try again.");
        }
    };

    if (!user) return null;
    return (
        <div className="form-background">
            <h1 className="form-title">
                {isEditing ? "Edit Event" : "Add New Event"}
            </h1>
            <EventForm
                eventData={eventData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isEditing={isEditing}
            />
        </div>
    );
};

export default FormPage;
