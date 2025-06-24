//Load environment variable
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");

const indexRouter = require("./routers/indexRouter");
const url = require("node:url");
const { urlencoded } = require("express");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Internal server error");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
