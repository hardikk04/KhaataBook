const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const userModel = require("../models/user-model");
const hisaabModel = require("../models/hisaab-model");

const app = express.Router();

app.get("/", (req, res) => {
  res.send("hello from hisaab");
});

app.get("/create", (req, res) => {
  const condition = req.flash("error").length > 0 ? true : false;
  res.render("create", { error: condition });
});

app.post("/create", isLoggedIn, async (req, res) => {
  try {
    const { title, description } = req.body;
    const hisaab = await hisaabModel.create({
      title,
      description,
      user: req.user.userId,
    });

    const user = await userModel.findOne({ _id: req.user.userId });
    user.hisaab.push(hisaab._id);
    await user.save();

    res.redirect("/profile");
  } catch (error) {
    req.flash("error", true);
    res.redirect("/hisaab/create");
  }
});

app.get("/view/:id", isLoggedIn, async (req, res) => {
  try {
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });
    res.render("view", { hisaab });
  } catch (error) {
    res.redirect("/error");
  }
});

app.get("/delete/:id", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ _id: req.user.userId })
      .populate("hisaab");
    await hisaabModel.findOneAndDelete({ _id: req.params.id });
    user.hisaab = user.hisaab.filter((h) => {
      return h._id.toString() !== req.params.id;
    });

    await user.save();

    res.redirect("/profile");
  } catch (error) {
    res.redirect("/error");
  }
});

module.exports = app;
