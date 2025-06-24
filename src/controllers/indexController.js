const userQueries = require("../db/userQueries");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const indexController = {
  index: (req, res) => {
    res.render("index", {
      title: "Welcome to our clubhouse",
      user: req.user,
    });
  },
  getRegisterPage: (req, res) => {
    res.render("register", { title: "Register Form" });
  },
  register: asyncHandler(async (req, res) => {
    console.log("Registering user");
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await userQueries.createUser({
      firstName,
      lastName,
      email,
      hashedPassword,
    });
    console.log("User registered");
    res.redirect("/login");
  }),
  getLoginPage: (req, res) => {
    res.render("login", { title: "Login Form" });
  },
  login: (req, res) => {
    res.redirect("/");
  },
};

module.exports = indexController;
