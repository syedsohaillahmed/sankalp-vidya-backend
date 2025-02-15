import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserRole } from "../models/users/userRole.model.js";
import { User } from "../models/users/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Student } from "../models/users/student.model.js";
import { Employee } from "../models/users/employee.model.js";
import internal from "stream";
import { Teacher } from "../models/users/Teacher.model.js";

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

const getUserRoles = asyncHandler(async (req, res, next) => {
  const userRoles = await UserRole.find();

  res.status(200).json({
    userRoles,
  });
});

const registerUser = asyncHandler(async (req, res, next) => {
  const {
    userName,
    fullName,
    dateOfBirth,
    password,
    phoneNo,
    alternatePhoneNo,
    email,
    rollNo,
    roleId,
    gender,
  } = req.body;

  if (!phoneNo || !fullName || !roleId || !dateOfBirth || !password) {
    throw new ApiError(
      400,
      "Bad Request: phoneNo, fullName, role, date of birth, and password are required"
    );
  }
  const queryConditions = [];
  if (phoneNo) queryConditions.push({ phoneNo });
  if (userName) queryConditions.push({ userName });
  if (email) queryConditions.push({ email });
  const existedUser = await User.findOne({
    $or: queryConditions,
  });

  if (existedUser) {
    throw new ApiError(409, "User Alredy Exist");
  }

  let uploadedAvatar = null;

  let avatarLocalPath = "";

  if (
    req.files &&
    Array.isArray(req?.files?.avatar) &&
    req?.files?.avatar?.length > 0
  ) {
    avatarLocalPath = req?.files?.avatar[0]?.path;
  }

  const roleData = await UserRole.findById(roleId);

  uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);

  const createdUser = await User.create({
    userName,
    fullName,
    avatar: uploadedAvatar?.url || "",
    dateOfBirth,
    phoneNo,
    password,
    alternatePhoneNo,
    email,
    rollNo,
    gender,
    role: roleId,
  });
  try {
    if (roleData?.roleName === "student") {
      await Student.create({
        userId: createdUser._id,
      });
    } else if (roleData?.roleName === "teacher") {
      await Teacher.create({
        userId: createdUser._id,
      });
    }
  } catch (error) {
    throw new ApiError(500, "internal server error while regestering the user");
  }

  const userData = await User.findById(createdUser._id).select(
    "-password -refreshToken"
  );

  if (!userData) {
    throw new ApiError(500, "Something Went Wrong while registering user");
  }

  res
    .status(201)
    .json(new ApiResponse(201, userData, "User Registerd Sucessfuly"));
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const userData = await User.findById(userId);

    const accessToken = await userData.generateAccessToken();
    const refreshToken = await userData.generateRefreshToken();

    userData.refreshToken = refreshToken;
    userData.save({ validateBeforSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generaing access and refresh token "
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { phoneNo, email, rollNo, password } = req.body;

  console.log(phoneNo, email, rollNo, password);

  if (!phoneNo && !email && !rollNo && !password) {
    throw new ApiError(400, "USer Details are required");
  }

  const userData = await User.findOne({
    $or: [{ phoneNo: phoneNo }],
  });

  if (!userData) {
    throw new ApiError(401, "Not a Registered User");
  }

  const validPassword = await userData.isPasswordCorrect(password);

  if (!validPassword) {
    throw new ApiError(401, "Bad Credentials");
  }

  console.log("validPassword", validPassword);

  console.log("userdata", userData);

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userData._id
  );

  const loggedInuser = await User.findById(userData._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: userData,
          refreshToken,
          accessToken,
        },
        "User Logged in Sucessfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log("from logout router", req.user);

  const updatedData = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this will remove the field from document
      },
    },
    {
      new: true,
    }
  );

  console.log("updated data", updatedData);
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out Sucessfully"));
});

export { registerUser, createUserRoles, getUserRoles, loginUser, logoutUser };
