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
import mongoose from "mongoose";
import { AcademicYear } from "../models/academic/academicYear/academicYear.model.js";
import { Class } from "../models/academic/class/class.model.js";
import { exists } from "fs";

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

const updateUserRoleById = asyncHandler(async (req, res) => {
  const roleId = req.params.id;

  // Validate roleId
  if (!roleId) {
    throw new ApiError(400, "Role ID is required");
  }

  // Extract roleDisplayName from the request body
  const { roleDisplayName } = req.body;

  // Validate roleDisplayName
  if (!roleDisplayName) {
    throw new ApiError(400, "Role display name is required");
  }

  // Find the role by ID
  const roleData = await UserRole.findById(roleId);

  // Check if the role exists
  if (!roleData) {
    throw new ApiError(404, "User role not found");
  }

  // Update the roleDisplayName
  roleData.roleDisplayName = roleDisplayName;

  // Save the updated role
  const updatedData = await roleData.save();

  // Send a success response
  res.status(200).json({
    success: true,
    message: "Role updated successfully",
    data: roleData,
  });
});

//email exists
const checkEmailExists = asyncHandler(async (req, res) => {
  const {email} = req.query

  if (!email || email.trim() === "") {
    throw new ApiError(404, "Email is required");
  }

  const existingUser = await User.findOne({
    email: email,
  });

  console.log("existingUser", existingUser);

  if (existingUser) {
    return res
      .status(200)
      .json(new ApiResponse(200, {exists:true}, "data already exists"));
  }

  return res.status(200).json(new ApiResponse(200, {exists:false}, "Email is available"));
});

//username exists

const checkUserNameExists = asyncHandler(async (req, res) => {
  const { userName } = req.query; 


  if (!userName || userName.trim() === "") {
    throw new ApiError(404, "username is required");
  }

  const existingUser = await User.exists({
    userName: userName,
  });

  console.log("existingUser", existingUser);

  if (existingUser) {
    return res
      .status(200)
      .json(new ApiResponse(200, { exists: true }, "data already exists"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { exists: false }, "User Name is available"));
});
//phoneno exists

//email exists
const checkPhoneNoExists = asyncHandler(async (req, res) => {
  const { phoneNo } = req.query; // phoneNo will now come from query params

  if (!phoneNo || phoneNo.trim() === "") {
    throw new ApiError(404, "phoneNo is required");
  }

  const existingUser = await User.exists({
    phoneNo: phoneNo,
  });

  console.log("existingUser", existingUser);

  if (existingUser) {
    return res
      .status(200)
      .json(new ApiResponse(200, { exists: true }, "data already exists"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { exists: false }, "phoneNo is available"));
});


const registerUser = asyncHandler(async (req, res, next) => {
  const {
    userName,
    fullName,
    dateOfBirth,
    userPassword,
    phoneNo,
    alternatePhoneNo,
    email,
    rollNo,
    roleId,
    gender,
  } = req.body;

  if (!phoneNo || !fullName || !gender || !dateOfBirth || !userPassword) {
    throw new ApiError(
      400,
      "Bad Request: phoneNo, fullName, role, date of birth, and password are required"
    );
  }

  if (!roleId) {
    throw new ApiError(400, "Bad Request: roleID is Required ");
  }
  const roleData = await UserRole.findById(roleId);

  if (!roleData) {
    throw new ApiError(500, "Something Went Wrong while fetching role details");
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

  uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);

  const createdUser = await User.create({
    userName,
    fullName,
    avatar: uploadedAvatar?.url || "",
    dateOfBirth,
    phoneNo,
    password: userPassword,
    alternatePhoneNo,
    email,
    rollNo,
    gender,
    role: roleId,
  });

  if (!createdUser) {
    throw new ApiError(500, "Something Went Wrong while registering user");
  }

  if (roleData?.roleName === "student") {
    const createdStudent = await Student.create({
      userId: createdUser._id,
    });
  } else if (roleData?.roleName === "teacher") {
    const createdTeacher = await Teacher.create({
      userId: createdUser._id,
    });
  }

  const { password, refreshToken, ...userResponse } = createdUser.toObject();

  res
    .status(201)
    .json(new ApiResponse(201, userResponse, "User Registerd Sucessfuly"));
});

const registerStudents = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // ✅ Start transaction

  try {
    const {
      userName,
      fullName,
      dateOfBirth,
      userPassword,
      phoneNo,
      alternatePhoneNo,
      email,
      rollNo,
      roleId,
      gender,
      academicYear,
      studentId,
      classId,
    } = req.body;
    // ✅ Validation
    if (!roleId) {
      throw new ApiError(400, "Bad Request: roleID is Required ");
    }
    if (
      !phoneNo ||
      !fullName ||
      !roleId ||
      !dateOfBirth ||
      !studentId ||
      !userPassword ||
      !gender ||
      !academicYear ||
      !classId
    ) {
      throw new ApiError(400, "Bad Request: Required fields are missing");
    }

    const classData = await Class.findById(classId).session(session);
    if (!classData) {
      throw new ApiError(500, "Not a Valid Class Id");
    }

    // ✅ Fetch role details
    const roleData = await UserRole.findById(roleId).session(session);
    if (!roleData) {
      throw new ApiError(500, "Not a valid role");
    }

    const academicYearData = await AcademicYear.findById(academicYear);
    if (!academicYearData) {
      throw new ApiError(500, "Not a Valid Academic Year");
    }

    // ✅ Check if user already exists
    const queryConditions = [];
    if (phoneNo) queryConditions.push({ phoneNo });
    if (userName) queryConditions.push({ userName });
    if (email) queryConditions.push({ email });

    const existedUser = await User.findOne({ $or: queryConditions }).session(
      session
    );
    if (existedUser) {
      throw new ApiError(409, "User Already Exists");
    }

    // ✅ Upload Avatar if exists
    let uploadedAvatar = null;
    if (
      req.files &&
      Array.isArray(req?.files?.avatar) &&
      req?.files?.avatar?.length > 0
    ) {
      uploadedAvatar = await uploadOnCloudinary(req?.files?.avatar[0]?.path);
    }

    // ✅ Create User inside transaction
    const createdUser = await User.create(
      [
        {
          userName,
          fullName,
          avatar: uploadedAvatar?.url || "",
          dateOfBirth,
          phoneNo,
          password: userPassword,
          alternatePhoneNo,
          email,
          rollNo,
          gender,
          role: roleId,
        },
      ],
      { session }
    );

    if (!createdUser) {
      throw new ApiError(500, "Something Went Wrong while registering user");
    }

    // ✅ Create Student inside transaction
    const createdStudent = await Student.create(
      [
        {
          userId: createdUser[0]._id, // Access first element since create() returns an array
          role: {
            id: roleData._id,
            displayName: roleData.roleDisplayName,
          },
          class: {
            id: classData._id,
            classGrade: classData.classGrade,
            displayName: classData.name,
          },
          academicYear: {
            id: academicYearData._id,
            displayName: academicYearData.academicYear,
            batchName: academicYearData.batchName,
          },
          studentId: studentId,
        },
      ],
      { session }
    );

    if (!createdStudent) {
      throw new ApiError(500, "Internal server error while creating student");
    }

    // ✅ Commit transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    // ✅ Send response
    const { password, refreshToken, ...userResponse } =
      createdUser[0].toObject();
    res
      .status(201)
      .json(
        new ApiResponse(201, userResponse, "Student Registered Successfully")
      );
  } catch (error) {
    // ❌ Rollback the transaction on failure
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const deleteStudent = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // ✅ Start transaction

  try {
    const { id } = req.params;

    // ✅ Check if student exists
    const student = await Student.findById(id).session(session);
    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    // ✅ Delete the student record
    await Student.deleteOne({ _id: id }).session(session);

    // ✅ Delete the associated user record
    await User.deleteOne({ _id: student.userId }).session(session);

    // ✅ Commit transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    // ✅ Send response
    res
      .status(200)
      .json(new ApiResponse(200, null, "Student deleted successfully"));
  } catch (error) {
    // ❌ Rollback the transaction on failure
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const { role, gender, page = 1, limit = 10 } = req.query;
  let filter = {};

  if (gender) {
    filter.gender = gender;
  }
  if (role) {
    filter.role = role;
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const excludeFields = {
    password: 0,
    refreshToken: 0,
    watchHistory: 0,
    rollNo: 0,
    ratings: 0,
    lastLogin: 0,
    logoutTime: 0,
    registrationDate: 0,
    createdBy: 0,
  }; // Add other fields if needed if include:1

  const usersList = await User.aggregatePaginate(
    User.aggregate([{ $match: filter }, { $project: excludeFields }]),
    options
  );

  const rolesCache = await UserRole.find().select("_id roleDisplayName").lean();
  const rolesMap = new Map(
    rolesCache.map((role) => [role._id.toString(), role.roleDisplayName])
  );

  usersList.docs = usersList.docs.map((user) => ({
    ...user,
    roleDisplayName: rolesMap.get(user.role.toString()) || "Unknown",
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, usersList, "Users List fetched successfully"));
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

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userData._id
  );

  const loggedInuser = await User.findById(userData._id).select(
    "-password -refreshToken"
  );

  const roleDetails = await UserRole.findById(loggedInuser?.role).select(
    "roleDisplayName"
  );

  let additionalData =[]

  if(roleDetails?.roleDisplayName === "Student"){
   const studentData = await Student.find({userId: userData._id})
   console.log("studentData", studentData)
   additionalData=studentData
  }

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
          user: loggedInuser,
          roleDetails,
          additionalData,
          refreshToken,
          accessToken,
        },
        "User Logged in Sucessfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
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

const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new ApiError(400, "student id is required");
  }

  const userDetails = await User.findById(userId).select(
    "-password, -refreshToken"
  );
  if (!userDetails) {
    throw new ApiError(400, "no user found");
  }

  const roleDetails = await UserRole.findById(userDetails?.role);
  const userDetailsWithRole = {
    userDetails,
    roleDisplayName: roleDetails.roleDisplayName,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userDetailsWithRole,
        "User Details fetched Successfully"
      )
    );
});

const updateUserDetailsById = asyncHandler(async (req, res) => {
  const { fullName, dateOfBirth, gender, alternatePhoneNo, email } = req.body;

  const userId = req.params.id;

  if (!userId) {
    throw new ApiError(401, "User id is Required");
  }

  // Check if required fields are present

  // Validate email format (simple regex check)
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Validate date of birth (make sure it's a valid date)
  if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
    throw new ApiError(400, "Invalid date of birth format");
  }

  // Validate alternatePhoneNo (must be exactly 10 digits)
  if (alternatePhoneNo && !/^\d{10}$/.test(alternatePhoneNo)) {
    throw new ApiError(400, "Alternate phone number must be exactly 10 digits");
  }

  const userData = await User.findById(userId);
  if (!userData) {
    throw new ApiError(401, "Not a valid user");
  }

  if (fullName) {
    if (fullName.trim() === "" || fullName === null || fullName === undefined) {
      throw new ApiError(400, "FullName cant be empty");
    }
    userData.fullName = fullName;
  }
  if (dateOfBirth) {
    if (
      dateOfBirth.trim() === "" ||
      dateOfBirth === null ||
      dateOfBirth === undefined
    ) {
      throw new ApiError(400, "Date of Birth cant be empty");
    }
    userData.dateOfBirth = dateOfBirth;
  }
  if (gender) userData.gender = gender;
  if (alternatePhoneNo) userData.alternatePhoneNo = alternatePhoneNo;
  if (email) userData.email = email;

  await userData.save();

  return res
    .status(201)
    .json(new ApiResponse(201, userData, "updated data successfully"));
});

const checkStudentrollNoExists = asyncHandler(async (req, res) => {
  const { studentId } = req.query;

  if (!studentId || studentId.trim() === "") {
    throw new ApiError(404, "studentId is required");
  }

  const existingUser = await Student.exists({
    studentId: studentId,
  });

  console.log("existingUser", existingUser);

  if (existingUser) {
    return res
      .status(200)
      .json(new ApiResponse(200, {exists: true}, "data already exists"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {exists: false}, "Student Id is available"));
});

const getStudentsList = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 100,
    gender,
    classId,
    studentId,
    fullName,
    active,
  } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  // Build the match query dynamically
  const matchQuery = {};
  if (classId) matchQuery["class.id"] = new mongoose.Types.ObjectId(classId);
  if (studentId) matchQuery["studentId"] = studentId;
  if (active !== undefined) matchQuery["active"] = active === "true"; // Convert string to boolean

  const userMatchQuery = {};
  if (gender) userMatchQuery["userDetails.gender"] = gender;
  if (fullName)
    userMatchQuery["userDetails.fullName"] = {
      $regex: fullName,
      $options: "i",
    }; // Case-insensitive search

  // Aggregation pipeline
  const aggregationPipeline = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" }, // Flatten the userDetails array
    {
      $match: {
        ...matchQuery, // Filters on Student collection
        ...userMatchQuery, // Filters on User collection
      },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        role: 1,
        class: 1,
        academicYear: 1,
        studentId: 1,
        active: 1,
        subjectsEnrolled: 1,
        createdAt: 1,
        updatedAt: 1,
        "basicDetails._id": "$userDetails._id",
        "basicDetails.fullName": "$userDetails.fullName",
        "basicDetails.avatar": "$userDetails.avatar",
        "basicDetails.dateOfBirth": "$userDetails.dateOfBirth",
        "basicDetails.gender": "$userDetails.gender",
        "basicDetails.phoneNo": "$userDetails.phoneNo",
        "basicDetails.registrationDate": "$userDetails.registrationDate",
      },
    },
  ];

  // Use aggregatePaginate for efficient pagination
  const studentsList = await Student.aggregatePaginate(
    Student.aggregate(aggregationPipeline),
    options
  );

  if (!studentsList.docs.length) {
    return res.status(200).json({
      message: "No students found",
      students: studentsList,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, studentsList, "Students List Fetched Successfully")
    );
});

const getStudentDetails = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;

  if (!studentId) {
    throw new ApiError(400, "student id is required");
  }

  // Perform the update operation
  const studentDetails = await Student.findById(studentId);

  // Check if the student was found and updated
  if (!studentDetails) {
    return res.status(404).json({ message: "Student not found" });
  }

  const userDetail = await User.findById(studentDetails.userId);

  const data = {
    studentDetails,
    userDetail,
  };

  // Return the updated student details
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Successfully fetched Student Details"));
});

const updateStudentDetails = asyncHandler(async (req, res, next) => {
  const studentId = req.params.id;
  const updateData = req.body;

  if (!studentId) {
    throw new ApiError(400, "student id is required");
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
      casteCertificateImage:
        updateData.caste.casteCertificateImage || undefined,
    };
  }

  // Mapping the income object (nested fields)
  if (updateData.income) {
    mappedData.income = {
      annualIncome: updateData.income.annualIncome || undefined,
      currency: updateData.income.currency || undefined,
      currencySymbol: updateData.income.currencySymbol || undefined,
      incomeCertificateImage:
        updateData.income.incomeCertificateImage || undefined,
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
  if (updateData.fathersOccupation)
    mappedData.fathersOccupation = updateData.fathersOccupation;
  if (updateData.mothersOccupation)
    mappedData.mothersOccupation = updateData.mothersOccupation;
  if (updateData.subjectsEnrolled)
    mappedData.subjectsEnrolled = updateData.subjectsEnrolled;
  if (updateData.studentId) mappedData.studentId = updateData.studentId;
  if (updateData.active !== undefined) mappedData.active = updateData.active;

  // Perform the update operation
  const updatedStudent = await Student.findByIdAndUpdate(
    studentId,
    mappedData,
    { new: true }
  );

  // Check if the student was found and updated
  if (!updatedStudent) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Return the updated student details
  return res
    .status(200)
    .json(new ApiResponse(201, updatedStudent, "Updated Student Details"));
});

export {
  registerUser,
  createUserRoles,
  getUserRoles,
  loginUser,
  logoutUser,
  updateStudentDetails,
  getUserDetails,
  updateUserRoleById,
  updateUserDetailsById,
  getUsers,
  getStudentsList,
  registerStudents,
  getStudentDetails,
  deleteStudent,
  checkEmailExists,
  checkPhoneNoExists,
  checkUserNameExists,
  checkStudentrollNoExists,
};
