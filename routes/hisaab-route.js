const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const userModel = require("../models/user-model");
const hisaabModel = require("../models/hisaab-model");

const app = express.Router();

app.get("/", (req, res) => {
  res.send("hello from hisaab");
});

app.post("/create", isLoggedIn, async (req, res) => {
  const { title, description } = req.body;
  const hisaab = await hisaabModel.create({
    title,
    description,
    user: req.user.userId,
  });

  const user = await userModel.findOne({ _id: req.user.userId });
  user.hisaab.push(hisaab._id);
  await user.save();

  res.send("created");
});

module.exports = app;
