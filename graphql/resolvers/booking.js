const { dateToString } = require("../../helpers/date");
const Booking = require("../../models/booking");
const Event = require("../../models/event");
const {
  singleEvent,
  user,
  transformBooking,
  transformEvent
} = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (req.isAuth) throw new Error("Unauthetificate");
    try {
      const bookings = await Booking.find();

      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthetificate");
    console.log("args");
    console.log(args);
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    console.log("fetchedEvent");

    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    });

    const result = await booking.save();

    return transformBooking(booking);
  },

  cancelBooking: async (args, req) => {
    if (req.isAuth) throw new Error("Unauthetificate");
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });

      return event;
    } catch (err) {
      throw err;
    }
  }
};
