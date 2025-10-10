import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { cookieOptions, JWT_SECRET } from "../constants.js";

{
  /* this is for auth + generate refresh token */
}
{
  /* 

 export const jwt_verify = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.noteAccess;
  const refreshToken = req.cookies?.noteRefresh;

  if (!accessToken && !refreshToken) {
    throw new ApiError(401, "Tokens not found");
  }

  try {
    // 🔹 Try verifying access token first
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) throw new ApiError(401, "Access token failed");

    req.user = user;
    return next();
  } catch (error) {
    try {
      // 🔸 Access token failed, try refresh token
      const decodedRefresh = jwt.verify(refreshToken, JWT_SECRET);
      const user = await User.findById(decodedRefresh._id);
      if (!user) throw new ApiError(401, "Refresh token failed");

      // Generate new tokens
      const newAccessToken = user.generateAccessToken();
      const newRefreshToken = user.generateRefreshToken();

      user.refreshToken = newRefreshToken;
      await user.save({ validateBeforeSave: false });

      // Set new cookies
      res.cookie("noteAccess", newAccessToken, {
        ...cookieOptions,
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      });
      res.cookie("noteRefresh", newRefreshToken, {
        ...cookieOptions,
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      });

      req.user = user;
      return next();
    } catch {
      throw new ApiError(401, "Unauthorized");
    }
  }
});

*/
}

export const jwt_verify = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.noteAccess || req.headers?.("authorization")?.replace("Bearer ", "");
  if (!accessToken) {
    throw new ApiError(401, "Access token not found");
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) throw new ApiError(401, "Access token failed");
    req.user = user;
    return next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized");
  }
});
