const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const dbgr = require("debug")("development:index-route");
const isLoggedIn = require("../middleware/isLoggedIn");
const redirectIfLogin = require("../middleware/redirectIfLogin");

const router = express.Router();

router.get("/", redirectIfLogin, (req, res) => {
  res.render("index", { error: req.flash("error"), nav: false });
});

router.get("/register", (req, res) => {
  res.render("register", { error: req.flash("error"), nav: false });
});

router.get("/error", (req, res) => {
  res.render("error");
});

router.post("/register", async (req, res) => {
  try {
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
          res.redirect("/profile");
        } catch (err) {
          req.flash("error", "All fields are required.");
          res.redirect("/register");
        }
      });
    }
  } catch (error) {
    res.redirect("/error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailorusername, password } = req.body;
    const userByEmail = await userModel.findOne({ email: emailorusername });

    if (userByEmail) {
      bcrypt.compare(password, userByEmail.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              username: userByEmail.username,
              userId: userByEmail._id,
            },
            process.env.JWT_SECRET
          );
          res.cookie("token", token);
          res.redirect("/profile");
        } else {
          req.flash("error", "Invalid credentials");
          res.redirect("/");
        }
      });
    } else {
      req.flash("error", "Invalid credentials");
      res.redirect("/");
    }
  } catch (error) {
    res.redirect("/error");
  }
});

router.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ _id: req.user.userId })
    .populate("hisaab");
  res.render("profile", { user });
});

module.exports = router;
