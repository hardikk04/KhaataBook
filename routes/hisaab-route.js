const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn-middleware");
const { userModel, userValidation } = require("../models/user-model");
const { hisaabModel, hisaabModelValidator } = require("../models/hisaab-model");

const router = express.Router();

router.get("/create", isLoggedIn, (req, res) => {
  res.render("create", { error: req.flash("error") });
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

    const { error } = hisaabModelValidator({
      title,
      description,
      shareable,
      encrypted,
      passcode,
      editPermission,
    });

    if (error !== undefined) {
      console.log(error.message);
      req.flash("error", error.message);
      res.redirect("/hisaab/create");
      return;
    }

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
    const user = await userModel.findOne({ _id: req.user.userId });
    res.render("view", { hisaab, user });
  } catch (error) {
    res.redirect("/error");
  }
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ _id: req.user.userId })
      .populate("hisaab");
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });
    if (user._id.toString() === hisaab.user.toString()) {
      await hisaabModel.findOneAndDelete({ _id: req.params.id });
      user.hisaab = user.hisaab.filter((h) => {
        return h._id.toString() !== req.params.id;
      });
      await user.save();
      res.redirect("/profile");
    } else {
      res.redirect("/profile");
    }
  } catch (error) {
    res.redirect("/error");
  }
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  try {
    const hisaab = await hisaabModel.findOne({ _id: req.params.id });

    res.render("edit", { error: req.flash("error"), hisaab });
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

    const { error } = hisaabModelValidator({
      title,
      description,
      encrypted,
      shareable,
      passcode,
      editPermission,
    });

    if (error !== undefined) {
      req.flash("error", error.message);
      res.redirect(req.get("Referer"));
      return;
    }

    const checkHisaab = await hisaabModel.findOne({ _id: req.params.id });

    if (req.user.userId === checkHisaab.user.toString()) {
      const hisaab = await hisaabModel.findOneAndUpdate(
        { _id: req.params.id },
        { title, description, encrypted, shareable, passcode, editPermission }
      );
      res.redirect("/profile");
    } else {
      res.send("ni manega");
    }
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
    const user = await userModel.findOne({ _id: req.user.userId });

    if (hisaab.passcode === Number(req.body.passcode)) {
      res.render("view", { hisaab, user });
    } else {
      req.flash("error", "Passcode incorrect");
      res.redirect(`/hisaab/view/passcode/${req.params.id}`);
    }
  } catch (error) {
    res.redirect("/error");
  }
});

module.exports = router;

// need to add share link
