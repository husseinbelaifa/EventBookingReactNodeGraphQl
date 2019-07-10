const User = require("../../models/user");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async args => {
    const user = User.findOne({ email: args.userInput.email });
    // if (user) throw new Error("User already exist");

    const bcryptPassword = await bcrypt.hash(args.userInput.password, 12);
    const userSaved = new User({
      email: args.userInput.email,
      password: bcryptPassword
    });
    const usersaved = await userSaved.save();
    if (usersaved) return { ...userSaved._doc, password: null };
    else throw new Error("could not save the user");
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "mysupersecretkey",
      { expiresIn: "1h" }
    );

    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};
