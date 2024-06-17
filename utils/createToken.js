const jwt = require("jsonwebtoken");

const getToken = (user) => {
  return (token = jwt.sign(
    { email: user.email, userId: user._id },
    process.env.JWT_SECRET
  ));
};

module.exports = getToken;
