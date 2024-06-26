const mongoose = require("mongoose");
const Joi = require("joi");

const userModel = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dp: {
    type: String,
    trim: true,
    default: "default.jpg",
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  hisaab: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hisaab",
    },
  ],
});

const userValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(20).required(),
    name: Joi.string().trim().required(),
    dp: Joi.string().trim().optional(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
    hisaab: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .optional(),
  });

  return schema.validate(data);
};

module.exports.userModel = mongoose.model("user", userModel);
module.exports.userValidation = userValidation;
