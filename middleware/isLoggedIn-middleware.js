const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      req.user = decoded;
      next();
    });
  } else {
    res.redirect("/");
  }
};

module.exports = isLoggedIn;

