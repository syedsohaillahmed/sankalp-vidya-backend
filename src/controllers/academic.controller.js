import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subject } from "../models/academic/subjects/subjects.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Class } from "../models/academic/class/class.model.js";

const addSubjects = asyncHandler(async (req, res, next) => {
  const { name,classGrade, description, board, subjectType, category, active } = req.body;
  console.log("name", name);

  if (!name) {
    throw new ApiError(401, "subject name is required", {});
  }

  if (!classGrade) {
    throw new ApiError(401, "class Grade name is required", {});
  }

  const createdSubject = await Subject.create({
    name,
    description,
    subjectType,
    board,
    category,
    active,
    classGrade
  });

  const subjectData = await Subject.findById(createdSubject._id);

  if (!subjectData) {
    throw new ApiError(500, "internal server error while creating Subject", {});
  }

  return res
    .status(201)
    .json(new ApiResponse(201, subjectData, "Subjected Created Sucessfully"));
});

const getAllSubjects = asyncHandler(async (req, res, next) => {
  const subjects = await Subject.find();
  return res
    .status(200)
    .json(new ApiResponse(200, subjects, "Subjects Feteched Sucessfully"));
});

const createClass = asyncHandler(async (req, res, next) => {
  const { name, alternateName, description, active, classGrade } = req.body;
  if (!name || !classGrade) {
    throw new ApiError(400, "Class Name/Grade is Required");
  }

  const createdClass = await Class.create({
    name,
    description,
    active,
    classGrade,
  });
  console.log("alternateName", createdClass);

  const classData = await Class.findById(createdClass._id);
  if (!classData) {
    throw new ApiError(500, "problem while creating data");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, classData, "Class created Successfully"));
});

const getAllClass = asyncHandler(async (req, res) => {
  const allClasses = await Class.find();
  if (!allClasses) {
    throw new ApiError(500, "Failed to Fetch class data");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allClasses, "fetched class data successfully"));
});

export { addSubjects, getAllSubjects, createClass, getAllClass };
