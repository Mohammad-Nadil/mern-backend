import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../model/user.model.js";
import validator from "validator";
import { cookieOptions, JWT_SECRET } from "../constants.js";
import { sendMail } from "../services/mail.service.js";
import { verifyMailTemplate } from "../template/mail/verifyMail.js";

const createToken = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("user not found", id);
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    console.log(user.generateAccessToken, user.generateRefreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Failed to create token");
  }
};

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});

const allUsers = asyncHandler(async (_req, res) => {
  const users = await User.find();
  res.status(200).json(new ApiResponse(200, "Users fetched successfully", users));
});

const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const CheckedEmail = validator.isEmail(email);
  if (!CheckedEmail) {
    throw new ApiError(400, "Email is not valid");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({ email, password });

  // Send verification email

  // const verifyLink = `http://localhost:5173/verify/${user._id}`;
  // await sendMail({
  //   to: user.email,
  //   subject: "Verify your email",
  //   text: `Click the link to verify your email: ${verifyLink}`,
  //   html: verifyMailTemplate(user.email, verifyLink),
  // });

  res.status(200).json(new ApiResponse(200, "User signed up successfully", user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await createToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("noteAccess", accessToken, { ...cookieOptions, maxAge: 1 * 24 * 60 * 60 * 1000 })
    .cookie("noteRefresh", refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, "User logged in successfully"));
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      refreshToken: null,
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("noteAccess")
    .clearCookie("noteRefresh")
    .json(new ApiResponse(200, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.noteRefresh;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("noteAccess", accessToken, { ...cookieOptions, maxAge: 1 * 24 * 60 * 60 * 1000 })
      .cookie("noteRefresh", newRefreshToken, {
        ...cookieOptions,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(200, "Access token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, "Unauthorized");
  }
});

export { allUsers, signup, login, logout, refreshAccessToken, getUser };
