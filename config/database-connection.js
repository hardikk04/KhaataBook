const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();

const dbgr = require("debug")("development:mongoose");

// dotenv configuration
dotenv.config();

const db = mongoose
  .connect(process.env.MONGOOSE_CONNECTION_URL)
  .then(() => {
    dbgr("connected");
  })
  .catch(() => {
    dbgr("not connected");
  });

module.exports = db;
