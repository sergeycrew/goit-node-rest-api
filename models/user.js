const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 4,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: { type: String, default: "" },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).min(4).required(),
  subscription: Joi.string().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).min(4).required(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const schemas = { registerSchema, loginSchema, updateSubscriptionSchema };

const User = model("user", userSchema);

module.exports = { User, schemas };
