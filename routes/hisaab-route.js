const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const userModel = require("../models/user-model");
const hisaabModel = require("../models/hisaab-model");

const router = express.Router();

router.get("/create", (req, res) => {
  const condition = req.flash("error").length > 0 ? true : false;
  res.render("create", { error: condition });
});

router.post("/create", isLoggedIn, async (req, res) => {
  try {
    const {
      title,
      description,
      shareable,
      encrypted,
      passcode,
      editPermission,
    } = req.body;

    const hisaab = await hisaabModel.create({
      title,
      description,
      user: req.user.userId,
      shareable,
      encrypted,
      passcode,
      editPermission,
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

router.get("/view/:id", isLoggedIn, async (req, res) => {
  try {
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });
    res.render("view", { hisaab });
  } catch (error) {
    res.redirect("/error");
  }
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
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

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  try {
    const condition = req.flash("error").length > 0 ? true : false;
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });

    res.render("edit", { error: condition, hisaab });
  } catch (error) {
    res.redirect("/error");
  }
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  try {
    let { title, description, encrypted, shareable, passcode, editPermission } =
      req.body;
    encrypted = encrypted ? encrypted : false;
    shareable = shareable ? shareable : false;
    editPermission = editPermission ? editPermission : false;

    const hisaab = await hisaabModel.findOneAndUpdate(
      { _id: req.params.id },
      { title, description, encrypted, shareable, passcode, editPermission }
    );
    res.redirect("/profile");
  } catch (error) {
    res.redirect("/error");
  }
});

router.get("/view/passcode/:id", isLoggedIn, async (req, res) => {
  try {
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });
    res.render("passcode", { hisaab, error: req.flash("error") });
  } catch (error) {
    res.redirect("/error");
  }
});

router.post("/view/passcode/:id", isLoggedIn, async (req, res) => {
  try {
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });

    if (hisaab.passcode === Number(req.body.passcode)) {
      res.render("view", { hisaab });
    } else {
      req.flash("error", "Passcode incorrect");
      res.redirect(`/hisaab/view/passcode/${req.params.id}`);
    }
  } catch (error) {
    res.redirect("/error");
  }
});

module.exports = router;
