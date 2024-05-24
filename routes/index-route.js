const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const dbgr = require("debug")("development:index-route");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register", { error: req.flash("error") });
});

router.post("/register", async (req, res) => {
  const { email, username, password, name } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    req.flash("error", "User already registered.");
    res.redirect("/register");
  } else {
    bcrypt.hash(password, 12, async (err, hash) => {
      try {
        const newUser = await userModel.create({
          email,
          username,
          password: hash,
          name,
        });
        const token = jwt.sign(
          { email, userId: newUser._id },
          process.env.JWT_SECRET
        );
        res.cookie("token", token);
        res.send("Welcome to profile");
      } catch (err) {
        req.flash("error", "Please fill all details and try again.");
        res.redirect("/register");
      }
    });
  }
});

module.exports = router;
