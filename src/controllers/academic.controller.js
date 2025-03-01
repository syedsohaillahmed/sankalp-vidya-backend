import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subject } from "../models/academic/subjects/subjects.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Class } from "../models/academic/class/class.model.js";
import { AcademicYear } from "../models/academic/academicYear/academicYear.model.js";
import { Chapter } from "../models/academic/subjects/chapter.model.js";

const createAcademicYear = asyncHandler(async (req, res, next) => {
  const { academicYear, batchCode, batchName, startDate, endDate, active } =
    req.body;
  if (!academicYear || academicYear.trim() === "") {
    throw new ApiError(400, "Academic year is Required");
  }

  if (!startDate) {
    throw new ApiError(400, "Start Date  is Required");
  }

  const postedAcademicYear = await AcademicYear.create({
    academicYear,
    batchCode,
    batchName,
    startDate,
    endDate,
    active,
  });

  const createdAcademicyear = await AcademicYear.findOne(
    postedAcademicYear._id
  );

  if (!createdAcademicyear) {
    throw new ApiError(400, "failed to create Academic year", {});
  }
  console.log(createdAcademicyear);

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdAcademicyear, "subject name is required")
    );
});

const getAllAcademicYear = asyncHandler(async (req, res, next) => {
  const academicYear = await AcademicYear.find();
  if (!academicYear) {
    throw new ApiError(500, "something went wrong");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        academicYear,
        "academic year data fetched sucessfully"
      )
    );
});

const getAcademicYearDetails = asyncHandler( async (req, res)=>{
  const academicId = req.params.id
  if(!academicId){
    throw(new ApiError(400, "Academic id is required"))
  }

  const academicDetails = await AcademicYear.findById(academicId)
  if(!academicDetails){
    throw(new ApiError(404, "Academic Detail not found"))
  }

  return res.status(200).json(
    new ApiResponse(200, academicDetails, "academic details fetched successfully")
  )


} )

const createSubjects = asyncHandler(async (req, res, next) => {
  const {
    name,
    classGrade,
    description,
    board,
    subjectType,
    category,
    active,
  } = req.body;
  console.log("name", name);

  if (!name) {
    throw new ApiError(401, "subject name is required", {});
  }

  const createdSubject = await Subject.create({
    name,
    description,
    subjectType,
    board,
    category,
    active,
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

const createChapter = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    subjectId,
    classId,
    academicYearId,
    publishedDate,
  } = req.body;
  console.log(
    "data, ",
    name,
    description,
    subjectId,
    classId,
    academicYearId,
    publishedDate
  );
  const createdChapter = await Chapter.create({
    name,
    description,
    subject: subjectId,
    class: classId,
    academicYear: academicYearId,
    publishedDate,
  });

  const chapter = await Chapter.findById(createdChapter._id);

  return res.status(200).json({
    message: chapter,
  });
});

const addNotesTochapter = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { file, fileName, author, uploadedBy } = req.body;

  if (!file || !fileName) {
    throw new ApiError(404, "file and file name is required");
  }

  if (!id) {
    throw new ApiError(404, "chapter id is required");
  }

  

  const notesData = {
    file,
    fileName,
    uploadedBy,
    author,
  };

  const updatedChapter = await Chapter.findByIdAndUpdate(
    { _id: id },
    { $push: { notes: notesData } },
    { new: true }
  );

  if (!updatedChapter) {
    throw new ApiError(500, "something went wrong while adding notes");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, updatedChapter, "Successfully added notes"));
});

export {
  createAcademicYear,
  createSubjects,
  getAllSubjects,
  createClass,
  getAllClass,
  getAllAcademicYear,
  createChapter,
  addNotesTochapter,
  getAcademicYearDetails
};
