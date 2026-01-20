import React, { useEffect, useState } from "react";
import Filters from "../Components/Events/Filters";
import EventList from "../Components/Events/EventList";

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [filterCity, setFilterCity] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");  // NEW

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
  }

  const filteredEvents = events
    .filter((event) =>
      event.location.toLowerCase().includes(filterCity.toLowerCase())
    )
    .filter((event) => {
      if (!filterDate) return true;
      return (
        new Date(event.date).toDateString() ===
        new Date(filterDate).toDateString()
      );
    })
    .filter((event) => {
      if (!filterCategory) return true;
      return event.category === filterCategory;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

  return (
    <div className="event-list-page">
      <div className="filter-wrapper">
        <Filters
          filterCity={filterCity}
          setFilterCity={setFilterCity}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterCategory={filterCategory}            // NEW
          setFilterCategory={setFilterCategory}      // NEW
        />
      </div>
      <div className="eventList">
        <EventList
          events={filteredEvents}
          editingId={editingId}
          editingData={editingData}
          startEditing={(event) => {
            setEditingId(event.id);
            setEditingData({ ...event });
          }}
          cancelEditing={() => {
            setEditingId(null);
            setEditingData({});
          }}
          handleEditInputChange={(e) =>
            setEditingData((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          saveEdit={async (id) => {
            const res = await fetch(`/api/events/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(editingData),
              credentials: "include",
            });
            if (res.ok) {
              setEditingId(null);
              await fetchEvents();
            }
          }}
          deleteEvent={async (id) => {
            if (confirm("Are you sure?")) {
              const res = await fetch(`/api/events/${id}`, {
                method: "DELETE",
                credentials: "include",
              });
              if (res.ok) fetchEvents();
            }
          }}
        />
        {filteredEvents.length === 0 && (
          <div className="no-events">
            <p className="no-events-message">There are no events on this day.</p>
            <button
              className="reset-filters-button"
              onClick={() => {
                setFilterCity("");
                setFilterDate("");
                setSortOrder("asc");
                setFilterCategory("");  // RESET category filter too
              }}
            >
              Back to All Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListPage;
