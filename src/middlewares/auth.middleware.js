import { User } from "../models/users/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  const decodeToken = await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  const user = await User.findById(decodeToken._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "invalid access token");
  }

  req.user = user;
  next();
});
