const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    role: {
      type: String,
      default: "user",
    },
    gender: {
      type: String,
      required: [true, "Please enter your gender"],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "The email format is incorrect",
      ],
      required: [true, "Please enter your mail"],
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please enter your date of birth"]
    },
    disabled: {
      type: Boolean,
      required: [true],
    },
    password: {
      type: String
    },
    tokens: [],
    evaluationIds: [{ type: Object, ref: "evaluation" }],
    favoritePlace: [{ type: Object, ref: "favoritePlace" }],
    favoriteRoute: [{ type: Object, ref: "favoriteRoute" }],
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  delete user.email;
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
