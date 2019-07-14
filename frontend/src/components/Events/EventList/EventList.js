import React from "react";
import EventItem from "./EventItem/EventItem";
import "./EventList.css";
const EventList = props => {
  const events =
    props.events &&
    props.events.map(event => {
      return (
        <EventItem
          key={event._id}
          eventId={event._id}
          eventTitle={event.title}
          userId={props.authUserId}
          creator={event.creator._id}
          price={event.price}
          date={event.date}
        />
      );
    });
  return <ul className="event__list">{events}</ul>;
};

export default EventList;
