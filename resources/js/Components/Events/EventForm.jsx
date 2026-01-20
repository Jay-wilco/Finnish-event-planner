import React from "react";
import { FiCalendar, FiMapPin, FiLink, FiPlus, FiTag } from "react-icons/fi";
import { MdEvent } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";

function EventForm({ eventData, handleInputChange, handleSubmit }) {
    return (
        <div className="event-form-page">
            <p>Fill the form below to create a new event</p>

            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                    <input
                        type="text"
                        name="title"
                        placeholder=" "
                        value={eventData.title || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        <MdEvent style={{ marginRight: "6px" }} />
                        Event Title
                    </label>
                </div>

                <div className="form-group">
                    <textarea
                        name="description"
                        placeholder=" "
                        value={eventData.description || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        <BiCommentDetail style={{ marginRight: "6px" }} />
                        Description
                    </label>
                </div>

                <div className="form-group">
                    <input
                        type="date"
                        name="date"
                        placeholder=" "
                        value={eventData.date || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        <FiCalendar style={{ marginRight: "8px" }} />
                        Event Date
                    </label>
                </div>

                <div className="form-group">
                    <input
                        type="time"
                        name="time"
                        placeholder=" "
                        value={eventData.time || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        <FiCalendar style={{ marginRight: "8px" }} />
                        Event Time (24-hour)
                    </label>
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="address"
                        placeholder=" "
                        value={eventData.address || ""}
                        onChange={handleInputChange}
                    />
                    <label>
                        <FiMapPin style={{ marginRight: "8px" }} />
                        Street Address
                    </label>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="location"
                        placeholder=" "
                        value={eventData.location || ""}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        <FiMapPin style={{ marginRight: "8px" }} />
                        City
                    </label>
                </div>

                <div className="form-group">
                    <select
                        name="category"
                        value={eventData.category || ""}
                        onChange={handleInputChange}
                        required
                        style={{
                            width: "100%",
                            height: "48px",
                            fontSize: "1rem",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            backgroundColor: "#fff",
                            color: eventData.category ? "#000" : "#888",
                        }}
                    >
                        <option value="" disabled>
                            Select Category
                        </option>
                        <option value="Social">Social</option>
                        <option value="Educational">Educational</option>
                        <option value="Corporate/Business">
                            Corporate/Business
                        </option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Sports & Fitness">
                            Sports & Fitness
                        </option>
                        <option value="Lifestyle & Hobby">
                            Lifestyle & Hobby
                        </option>
                        <option value="Political & Civic">
                            Political & Civic
                        </option>
                        <option value="Religious & Spiritual">
                            Religious & Spiritual
                        </option>
                        <option value="Community & Charity">
                            Community & Charity
                        </option>
                        <option value="Virtual & Hybrid">
                            Virtual & Hybrid
                        </option>
                        <option value="Tech">Tech</option>
                        <option value="Other">Other</option>
                    </select>
                    <label>
                        <FiTag style={{ marginRight: "8px" }} />
                        Category
                    </label>
                </div>

                <div className="form-group">
                    <input
                        type="url"
                        name="image_url"
                        placeholder=" "
                        value={eventData.image_url || ""}
                        onChange={handleInputChange}
                    />
                    <label>
                        <FiLink style={{ marginRight: "8px" }} />
                        Image URL (optional)
                    </label>
                </div>

                <button type="submit">
                    <FiPlus />
                    Save Event
                </button>
            </form>
        </div>
    );
}

export default EventForm;
