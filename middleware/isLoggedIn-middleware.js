const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err === null) {
        req.user = decoded;
        next();
      } else {
        res.clearCookie("token");
        return res.redirect("/");
      }
    });
  } else {
    return res.redirect("/");
  }
};

module.exports = isLoggedIn;
