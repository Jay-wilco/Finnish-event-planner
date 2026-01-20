import React, { useEffect, useState } from "react";
import EventCard from "../Components/Events/EventCard";
import { NavLink } from "react-router-dom";
import "../styles/Home.css";
import "../styles/EventCard.css";

function Home() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("/api/events")
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                setEvents(sorted.slice(0, 3));
            });
    }, []);

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-content left-align">
                        <h1>
                            Discover and Enjoy <br />
                            Local Events
                        </h1>
                        <p>
                            Explore exciting local events in your community.
                            From BBQs to outdoor concerts, there’s something for
                            everyone.
                        </p>
                        <div className="hero-button">
                            <NavLink to="/events" className="button-link">
                                Discover Events
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>

            <section className="upcoming-events">
                <h3>Upcoming Events</h3>
                <p className="subtext-color2">
                See the latest events happening in your area.
                </p>
                <div className="event-grid">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
                <div className="view-all">
                    <NavLink to="/events" className="view-all-btn">
                        View All Events
                    </NavLink>
                </div>
            </section>
        </div>
    );
}

export default Home;
