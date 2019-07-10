const { dateToString } = require("../../helpers/date");
const Event = require("../../models/event");
const User = require("../../models/user");
const { user, transformEvent } = require("./merge");

module.exports = {
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return transformEvent(event);
        });
      })
      .catch(err => {
        throw err;
      });
  },

  createEvent: (args, req) => {
    if (!req.isAuth) throw new Error("Unauthetificate");

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: "5d248d3f543a9b0e7cb5248e"
    });

    let createdEvent;

    return event
      .save()
      .then(eventSaved => {
        createdEvent = { ...eventSaved._doc };
        return User.findById("5d248d3f543a9b0e7cb5248e");
        // console.log(eventSaved);
        // return { ...eventSaved._doc };
      })
      .then(user => {
        if (!user) throw new Error("User not found");

        user.createdEvent.push(event);
        return user.save();
      })
      .then(userSaved => {
        return Event.findById(createdEvent._id)
          .populate({ path: "creator", populate: { path: "createdEvent" } })
          .then(eventFound => {
            return { ...eventFound, date: new Date(event.date).toISOString() };
          });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
};
