import React from "react";
import "./EventItem.css";

const EventItem = props => {
  return (
    <li key={props.eventId} className="events__list-item">
      {props.eventTitle}
    </li>
  );
};

export default EventItem;
