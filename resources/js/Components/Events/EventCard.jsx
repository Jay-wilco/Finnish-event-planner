import React from "react";
import { Link } from "react-router-dom";
import "../../styles/EventCard.css";
import { categoryEmojis } from "../../data/categoryEmojis";

function EventCard({ event, editingId, editingData, handleEditInputChange }) {
    const isEditing = editingId === event.id;

    // Prepare formatted location string
    const locationDisplay = event.address
        ? `${event.address}, ${event.location}`
        : event.location;

    // Shorten description to 100 chars + ellipsis if needed
    const shortenedDescription =
        event.description.length > 100
            ? event.description.slice(0, 100) + "..."
            : event.description;

    return (
        <div className="eventCard">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        name="title"
                        value={editingData.title}
                        onChange={handleEditInputChange}
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={editingData.date}
                        onChange={handleEditInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        value={editingData.location}
                        onChange={handleEditInputChange}
                        required
                    />
                    <textarea
                        name="description"
                        value={editingData.description}
                        onChange={handleEditInputChange}
                        required
                    />
                    <input
                        type="url"
                        name="image_url"
                        value={editingData.image_url}
                        onChange={handleEditInputChange}
                    />
                </>
            ) : (
                <>
                    <div className="event-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h2>{event.title}</h2>
                        {event.weather ? (
                            <img
                                src={`http://openweathermap.org/img/wn/${event.weather.icon}@2x.png`}
                                alt={event.weather.description}
                                className="weather-icon-small"
                                tabIndex={0}
                            />
                        ) : (
                            <p className="no-weather">🌫️</p>
                        )}
                    </div>

                    <div className="category-wrapper">
    {categoryEmojis[event.category]?.map((emoji, index) => (
        <span key={index} className="category-tag">
            {emoji}
        </span>
    ))}
</div>
                    <p className="date-time-location" style={{ whiteSpace: "pre-line" }}>
                        📅 {event.date} <br />
                        🕒 {event.time} <br />
                        📍 {locationDisplay}
                    </p>

                    <p className="description-text">{shortenedDescription}</p>

                    {event.image_url && (
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="event-image"
                        />
                    )}

                    <div className="card-buttons">
                        <Link
                            to={`/events/${event.id}`}
                            className="view-details-link"
                        >
                            View Details
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default EventCard;
