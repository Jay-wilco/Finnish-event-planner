import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/SingleEvent.css";

const SingleEvent = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${id}`);
                if (response.ok) {
                    const eventData = await response.json();
                    setEvent(eventData);
                } else if (response.status === 404) {
                    setEvent(null);
                    console.warn(`Event with ID ${id} not found.`);
                } else {
                    console.error(
                        "Failed to fetch event details:",
                        response.status,
                        await response.text()
                    );
                }
            } catch (error) {
                console.error("Error loading event:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const isFutureOrRecent = (dateStr) => {
        const eventDate = new Date(dateStr);
        const today = new Date();
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(today.getDate() - 5);
        return eventDate >= fiveDaysAgo;
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event?"))
            return;

        try {
            const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("Event deleted successfully");
                navigate("/events");
            } else {
                alert("Failed to delete event");
            }
        } catch (err) {
            alert("Error deleting event");
            console.error(err);
        }
    };

    const handleEdit = () => {
        navigate(`/events/${id}/edit`);
    };

    if (loading) return <p>Loading event details...</p>;
    if (!event) return <p>Event not found.</p>;

    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const mapLocation = event.address ? event.address : event.location;

    const encodedMapLocation = encodeURIComponent(mapLocation);

    return (
        <main className="event-detail-container">
            <section className="main-content">
                <h2 className="event-title">{event.title}</h2>

                {event.image_url && (
                    <img
                        src={event.image_url}
                        alt={event.title}
                        style={{ maxWidth: "100%", borderRadius: "8px" }}
                    />
                )}

                <div className="event-canvas">
                    <p>
                        📍{" "}
                        {event.address
                            ? `${event.address}, ${event.location}`
                            : event.location}
                    </p>
                    <p>
                        📅 {formattedDate} at {event.time}
                    </p>
                </div>

                <div className="event-canvas">
                    <p>{event.description}</p>
                </div>

                <div className="event-canvas">
                    <p className="weather-heading">Weather Forecast</p>
                    {event.weather &&
                    event.weather.temp !== null &&
                    isFutureOrRecent(event.date) ? (
                        <p>
                            <img
                                src={`https://openweathermap.org/img/wn/${event.weather.icon}@2x.png`}
                                alt={event.weather.description}
                                width="50"
                                height="50"
                                style={{
                                    verticalAlign: "middle",
                                    marginRight: "8px",
                                }}
                            />
                            {event.weather.description}, {event.weather.temp}°C
                        </p>
                    ) : (
                        <p>No weather data available</p>
                    )}
                </div>
            </section>

            <aside className="sidebar">
                {mapLocation && (
                    <iframe
                        title="map"
                        width="100%"
                        height="250"
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${encodedMapLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        style={{ borderRadius: "8px" }}
                    ></iframe>
                )}

                {user && (
                    <div className="event-actions">
                        <button className="edit-button" onClick={handleEdit}>
                            Edit
                        </button>
                        <button
                            className="delete-button"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </aside>
        </main>
    );
};

export default SingleEvent;
