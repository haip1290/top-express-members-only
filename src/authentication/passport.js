const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userQueries = require("../db/userQueries");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        const user = await userQueries.getUserByEmail(username);
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userQueries.getUserById(id);
    if (!user) {
      console.log("User not found during serialization");
      return done(null, false, { message: "User not found" });
    }
    done(null, user);
  } catch (error) {
    return done(error);
  }
});

module.exports = passport;
