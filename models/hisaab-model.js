const mongoose = require("mongoose");
const Joi = require("joi");

const hisaabSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    encrypted: {
      type: Boolean,
      default: false,
    },
    shareable: {
      type: Boolean,
      default: false,
    },
    passcode: {
      type: Number,
      default: "",
    },
    editPermission: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const hisaabValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    user: Joi.string().regex(/^[0-9a-fA-F]{24}$/),

    encrypted: Joi.boolean().default(false),
    shareable: Joi.boolean().default(false),
    passcode: Joi.number().default(""),
    editPermission: Joi.boolean().default(false),
  });

  return schema.validate(data);
};

module.exports.hisaabModel = mongoose.model("hisaab", hisaabSchema);
module.exports.hisaabModelValidator = hisaabValidation;
