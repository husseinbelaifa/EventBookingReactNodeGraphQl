const authResolver = require("./auth");
const eventResolver = require("./event");
const bookingResolver = require("./booking");

const RootResolver = {
  ...authResolver,
  ...eventResolver,
  ...bookingResolver
};

module.exports = RootResolver;
