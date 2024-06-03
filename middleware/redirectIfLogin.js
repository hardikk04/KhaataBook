const redirectIfLogin = (req, res, next) => {
  if (req.cookies.token) {
    res.redirect("/profile");
  } else {
    next();
  }
};

module.exports = redirectIfLogin;
