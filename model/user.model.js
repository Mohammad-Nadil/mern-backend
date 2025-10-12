import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    password: String,
    refreshToken: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    return jwt.sign(
      {
        _id: this._id,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
  } catch (error) {
    console.log("Access token error", error);
  }
};

userSchema.methods.generateRefreshToken = function () {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    return jwt.sign(
      {
        _id: this._id,
      },
      JWT_SECRET,
      { expiresIn: "10d" }
    );
  } catch (error) {
    console.log("Refresh token error", error);
  }
};

const User = mongoose.model("User", userSchema);
export default User;
