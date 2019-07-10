const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const bcrypt = require("bcryptjs");

module.exports = {
  events: () => {
    return Event.find()
      .populate({
        path: "creator",
        populate: {
          path: "createdEvent"
        }
      })
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            date: new Date(event._doc.date).toISOString()
            // creator: user.bind(this, event._doc.creator)
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();

      return bookings.map(booking => {
        return {
          ...booking._doc,
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString()
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
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
  },

  createUser: args => {
    return User.findOne({ email: args.userInput.email }).then(user => {
      if (user) throw new Error("User already exist");
      else {
        return bcrypt
          .hash(args.userInput.password, 12)
          .then(hashedPassword => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            });

            return user.save();
          })
          .then(userSaved => {
            return { ...userSaved._doc, password: null };
          })
          .catch(err => {
            throw err;
          });
      }
    });
  },
  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });

    const booking = new Booking({
      user: "5d248d3f543a9b0e7cb5248e",
      event: fetchedEvent
    });

    const result = await booking.save();

    return {
      ...result._doc,
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString()
    };
  }
};
