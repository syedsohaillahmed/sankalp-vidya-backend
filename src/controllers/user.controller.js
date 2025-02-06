import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserRole } from "../models/users/userRole.model.js";
const registerUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    message: "ok",
  });
});

const createUserRoles = asyncHandler(async (req, res, next) => {
  const { roleName, roleId, active } = req.body;
  if (!roleName) {
    throw new ApiError(500, "name is required");
  }

  const userRole = await UserRole.create({
    roleName: roleName,
    roleId: roleId,
  });

  const createdUserRole = await UserRole.findById(userRole._id);

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUserRole, "User Role Created Succesfully")
    );
});

const getUserRoles = asyncHandler( async (req, res, next)=>{
  const userRoles = await UserRole.find()
  console.log("userRoles", userRoles)
  res.status(200).json({
    userRoles
  })
} )

export { registerUser, createUserRoles, getUserRoles };
