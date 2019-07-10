const User = require("../../models/booking");

const bcrypt = require("bcryptjs");

module.exports = {
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
  }
};
