//Load environment variable
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./authentication/passport");
const indexRouter = require("./routers/indexRouter");
const usersRouter = require("./routers/usersRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use(passport.session());
app.use(flash());

app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Internal server error");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
