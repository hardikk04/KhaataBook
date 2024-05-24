// packages imports
const express = require("express");
const path = require("path");
const dbgr = require("debug")("development:app");
const flash = require("connect-flash");
const expressSession = require("express-session");

// dotenv configuration
const dotenv = require("dotenv");
require("dotenv").config();

// Database configuration & models
const db = require("./config/database-connection");

// Routes
const indexRoute = require("./routes/index-route");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use("/", indexRoute);

app.listen(process.env.PORT, () => {
  dbgr("server listening on port " + process.env.PORT);
});
