import React from "react";
import "../../styles/Filters.css";

const categories = [
  "Social",
  "Educational",
  "Corporate/Business",
  "Entertainment",
  "Sports & Fitness",
  "Lifestyle & Hobby",
  "Political & Civic",
  "Religious & Spiritual",
  "Community & Charity",
  "Virtual & Hybrid",
  "Tech",
  "Other",
];

function Filters({
  filterCity,
  setFilterCity,
  filterDate,
  setFilterDate,
  sortOrder,
  setSortOrder,
  filterCategory,
  setFilterCategory,
}) {
  return (
    <div className="filter-bar">
      <h2 className="filter-title">Browse and search local events in your community</h2>
      <div className="filter-controls">
        {/* Filter by City */}
        <label className="filter-label">
          Filter by City:
          <input
            type="text"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            placeholder="Enter city"
            className="filter-input"
          />
        </label>

        {/* Filter by Date */}
        <label className="filter-label">
          Filter by Date:
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="filter-date"
          />
        </label>

        {/* Sort by Date */}
        <label className="filter-label">
          Sort by Date:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        {/* Sort by Category */}
        <label className="filter-label">
          Sort by Event types:
          <select
            value={filterCategory || ""}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Event types</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default Filters;
