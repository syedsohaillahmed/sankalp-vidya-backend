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


const updateStudentDetails = asyncHandler(async (req, res, next) => {

  try {
    const studentId = req.params.id; // Assuming you're getting the student ID in the URL params
    const updateData = req.body; // The data to update is in the request body

    if(!studentId){
      throw new ApiError(400, "student id is required")
    }

    // Map the incoming data to match the schema fields
    const mappedData = {};

    // Mapping fields from the request body to schema
    if (updateData.motherName) mappedData.motherName = updateData.motherName;
    if (updateData.fatherName) mappedData.fatherName = updateData.fatherName;
    
    // Mapping the caste object (nested fields)
    if (updateData.caste) {
      mappedData.caste = {
        casteName: updateData.caste.casteName || undefined,
        category: updateData.caste.category || undefined,
        casteCertificateImage: updateData.caste.casteCertificateImage || undefined,
      };
    }
    
    // Mapping the income object (nested fields)
    if (updateData.income) {
      mappedData.income = {
        annualIncome: updateData.income.annualIncome || undefined,
        currency: updateData.income.currency || undefined,
        currencySymbol: updateData.income.currencySymbol || undefined,
        incomeCertificateImage: updateData.income.incomeCertificateImage || undefined,
      };
    }

    // Other fields
    if (updateData.schoolName) mappedData.schoolName = updateData.schoolName;
    if (updateData.schoolAddress) {
      mappedData.schoolAddress = {
        street: updateData.schoolAddress.street || undefined,
        city: updateData.schoolAddress.city || undefined,
        zipCode: updateData.schoolAddress.zipCode || undefined,
        state: updateData.schoolAddress.state || undefined,
        country: updateData.schoolAddress.country || undefined,
      };
    }

    // Home Address (nested object)
    if (updateData.homeAddress) {
      mappedData.homeAddress = {
        street: updateData.homeAddress.street || undefined,
        city: updateData.homeAddress.city || undefined,
        zipCode: updateData.homeAddress.zipCode || undefined,
        state: updateData.homeAddress.state || undefined,
        country: updateData.homeAddress.country || undefined,
      };
    }

    // Other fields like Aadhar, PAN, Occupation, etc.
    if (updateData.aadharId) mappedData.aadharId = updateData.aadharId;
    if (updateData.aadharImage) mappedData.aadharImage = updateData.aadharImage;
    if (updateData.panId) mappedData.panId = updateData.panId;
    if (updateData.panImage) mappedData.panImage = updateData.panImage;
    if (updateData.fathersOccupation) mappedData.fathersOccupation = updateData.fathersOccupation;
    if (updateData.mothersOccupation) mappedData.mothersOccupation = updateData.mothersOccupation;
    if (updateData.classGrade) mappedData.classGrade = updateData.classGrade;
    if (updateData.academicYear) mappedData.academicYear = updateData.academicYear;
    if (updateData.subjectsEnrolled) mappedData.subjectsEnrolled = updateData.subjectsEnrolled;
    if (updateData.studentId) mappedData.studentId = updateData.studentId;
    if (updateData.active !== undefined) mappedData.active = updateData.active;

    // Perform the update operation
    const updatedStudent = await Student.findByIdAndUpdate(studentId, mappedData, { new: true });

    // Check if the student was found and updated
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Return the updated student details
    return res.status(200).json(updatedStudent);

  } catch (error) {
    next(error); // Pass error to the error handler middleware
  }
});

export default updateStudentDetails;


export { registerUser, createUserRoles, getUserRoles, loginUser, logoutUser, updateStudentDetails };
