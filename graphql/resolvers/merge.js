const DataLoader = require("dataloader");
const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const { dateToString } = require("../../helpers/date");

const eventLoader = new DataLoader(eventId => {
  return events(eventId);
});

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

const transformBooking = booking => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator)
  };
};

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());

    return event;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());

    return {
      ...user._doc,
      createdEvent: eventLoader.load.bind(this, user._doc.createdEvent)
    };
  } catch (err) {
    throw err;
  }
};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

exports.user = user;
exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;

exports.events = events;
exports.singleEvent = singleEvent;
