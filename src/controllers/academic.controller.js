import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subject } from "../models/academic/subjects/subjects.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Class } from "../models/academic/class/class.model.js";
import { AcademicYear } from "../models/academic/academicYear/academicYear.model.js";
import { Chapter } from "../models/academic/subjects/chapter.model.js";
import { Student } from "../models/users/student.model.js";
import { YtVideoAttendance } from "../models/academic/subjects/ytVideoAttendence.model.js";

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

const getAcademicYearDetails = asyncHandler(async (req, res) => {
  const academicId = req.params.id;
  if (!academicId) {
    throw new ApiError(400, "Academic id is required");
  }

  const academicDetails = await AcademicYear.findById(academicId);
  if (!academicDetails) {
    throw new ApiError(404, "Academic Detail not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        academicDetails,
        "academic details fetched successfully"
      )
    );
});

const deleteAcademicyearById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw (400, new ApiError(400, null, "Academic year id is required"));
  }
  // Check if the class exists in any chapter
  const academicYearInChapter = await Chapter.exists({
    "academicYear.id": id,
  });
  console.log("academicYearInChapter", academicYearInChapter);
  if (academicYearInChapter) {
    throw new ApiError(
      400,
      "Cannot delete Academic Year as it is associated with a chapter"
    );
  }

  const academicYearInStudent = await Student.exists({
    "academicYear.id": id,
  });

  if (academicYearInStudent) {
    throw new ApiError(
      400,
      "Cannot delete Academic Year as it is associated with a Student"
    );
  }

  const acdemicYear = await AcademicYear.deleteOne({ _id: id });
  if (acdemicYear?.deletedCount === 0) {
    throw new ApiError(400, "Academic Year does not exists");
  }

  console.log("acdemicYear", acdemicYear);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Academic Year Deleted Successfully"));
});

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

const deleteSubjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw (400, new ApiError(400, null, "Class id is required"));
  }
  // Check if the class exists in any chapter
  const subjectExistInChapter = await Chapter.exists({
    "subject.id": id,
  });
  console.log("subjectExistInChapter", subjectExistInChapter);
  if (subjectExistInChapter) {
    throw new ApiError(
      400,
      "Cannot delete Subject as it is associated with a chapter"
    );
  }

  const deletedSubject = await Subject.deleteOne({ _id: id });
  if (deletedSubject?.deletedCount === 0) {
    throw new ApiError(400, "Subject does not exists");
  }

  console.log("deletedSubject", deletedSubject);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subject Deleted Successfully"));
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

const deleteClassById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw (400, new ApiError(400, null, "Class id is required"));
  }
  // Check if the class exists in any chapter
  const classExistInChapter = await Chapter.exists({
    "class.id": id,
  });

  const classExistingStudent = await Student.exists({
    "class.id": id,
  });
  console.log("classExistInChapter", classExistInChapter);
  if (classExistInChapter) {
    throw new ApiError(
      400,
      "Cannot delete class as it is associated with a chapter"
    );
  }

  if (classExistingStudent) {
    throw new ApiError(
      400,
      "Cannot delete class as it is associated with a Student"
    );
  }

  const deletedClass = await Class.deleteOne({ _id: id });
  console.log("deletedClass", deletedClass);
  if (deletedClass?.deletedCount === 0) {
    throw new ApiError(400, "Class does not exists");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Class Deleted Successfully"));
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

  if (!subjectId || !name || !subjectId || !classId || !academicYearId) {
    throw new ApiError(
      401,
      "subjectId || name || subjectId || classId || academicYearId are required"
    );
  }

  const subjectData = await Subject.findById(subjectId);
  if (!subjectData) {
    throw new ApiError(401, "Not a valid Subject");
  }
  const classData = await Class.findById(classId);
  if (!classData) {
    throw new ApiError(401, "Not a valid Class");
  }

  const academicYearData = await AcademicYear.findById(academicYearId);
  if (!academicYearData) {
    throw new ApiError(401, "Not a valid Academic year");
  }
  const createdChapter = await Chapter.create({
    name,
    description,
    subject: {
      id: subjectData?._id,
      displayName: subjectData?.name,
      board: subjectData?.board,
    },
    class: {
      id: classData?._id,
      name: classData?.name,
      classGrade: classData?.classGrade,
    },
    academicYear: {
      id: academicYearData?._id,
      displayName: academicYearData?.academicYear,
      batchName: academicYearData?.batchName,
    },
    publishedDate,
  });

  const chapter = await Chapter.findById(createdChapter._id);

  return res
    .status(201)
    .json(new ApiResponse(201, chapter, "Successfully created chapter"));
});

const getAllChapter = asyncHandler(async (req, res) => {
  const { classId, studentId } = req.query;

  // Validate studentId is provided
  if (!studentId) {
    return res.status(400).json({
      message: 'studentId is required'
    });
  }

  let filter = {};
  if (classId) {
    filter = { "class.id": classId };
  }

  // Get all chapters
  const chapters = await Chapter.find(filter).lean();

  // Get all video IDs from all chapters
  const allVideoIds = chapters.flatMap(chapter => 
    chapter.videos.map(video => video._id.toString())
  );

  // Get attendance records for these videos and the student
  const attendanceRecords = await YtVideoAttendance.find({
    "video.id": { $in: allVideoIds },
    "student.id": studentId
  });

  // Create a map of videoId to attendance status for quick lookup
  const attendanceMap = new Map();
  attendanceRecords.forEach(record => {
    attendanceMap.set(record.video.id.toString(), {
      watched: true,
      watchedAt: record.watchedAt,
      completed: record.completed
    });
  });

  // Enhance chapters with attendance status
  const enhancedChapters = chapters.map(chapter => ({
    ...chapter,
    videos: chapter.videos.map(video => ({
      ...video,
      attendance: attendanceMap.get(video._id.toString()) || {
        watched: false,
        watchedAt: null,
        completed: false
      }
    }))
  }));

  return res.status(200).json(
    new ApiResponse(200, enhancedChapters, "Chapter details with attendance fetched successfully")
  );
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

// const addVideoUrlToChapter = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { videoEmbededLink, title, description, videoUrl, videoSource, author } = req.body;

//   // Validation (same as before)
//   if (!id) throw new ApiError(400, "Chapter ID is required");
//   if (!videoUrl || !title) throw new ApiError(400, "Video URL and Title are required");

//   const chapter = await Chapter.findById(id);
//   if (!chapter) throw new ApiError(404, "Chapter not found");

//   const newVideo = {
//     videoEmbededLink,
//     title,
//     description,
//     videoUrl,
//     videoSource,
//     author,
//     uploadDate: new Date(),
//     videoUploadedToSourceDate: new Date(),
//   };

//   chapter.videos.push(newVideo);
//   const updatedChapter = await chapter.save();
//   console.log("updatedChapter", updatedChapter)

//   // Create attendance record for this video (without students)
//   const attendanceRecord = new YtVideoAttendance({
//     video: {
//       id: updatedChapter._id,
//       title: updatedChapter.title,
//       videoUrl: updatedChapter.videoUrl,
//       uploadDate: updatedChapter.uploadDate
//     },
//     chapter: {
//       id: chapter._id,
//       name: chapter.name
//     },
//     class: {
//       id: chapter.class.id,
//       name: chapter.class.name
//     },
//     students: [] // Empty array to be populated later
//   });

//   await attendanceRecord.save();

//   res.status(200).json(
//     new ApiResponse(200, updatedChapter, "Video added to chapter successfully")
//   );
// });


const addVideoUrlToChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { videoEmbededLink, title, description, videoUrl, videoSource, author } = req.body;

  // Validation (same as before)
  if (!id) throw new ApiError(400, "Chapter ID is required");
  if (!videoUrl || !title) throw new ApiError(400, "Video URL and Title are required");

  const chapter = await Chapter.findById(id);
  if (!chapter) throw new ApiError(404, "Chapter not found");

  const newVideo = {
    videoEmbededLink,
    title,
    description,
    videoUrl,
    videoSource,
    author,
    uploadDate: new Date(),
    videoUploadedToSourceDate: new Date(),
  };

  chapter.videos.push(newVideo);
  const updatedChapter = await chapter.save();
  console.log("updatedChapter", updatedChapter);

  // Get the latest added video (last element of the array)
  const latestVideo = updatedChapter.videos[updatedChapter.videos.length - 1];

  // Create attendance record for this video (without students)
  const attendanceRecord = new YtVideoAttendance({
    video: {
      id: latestVideo._id,
      title: latestVideo.title,
      videoUrl: latestVideo.videoUrl,
      uploadDate: latestVideo.uploadDate,
    },
    chapter: {
      id: chapter._id,
      name: chapter.name,
    },
    class: {
      id: chapter.class.id,
      name: chapter.class.name,
    },
    students: [], // Empty array to be populated later
  });

  await attendanceRecord.save();

  res.status(200).json(
    new ApiResponse(200, updatedChapter, "Video added to chapter successfully")
  );
});



// const markVideoAttendance = asyncHandler(async (req, res) => {
//   const { videoId, studentId } = req.params;

//   console.log("videoId", videoId)
//   console.log("studentId", studentId)


//   // Validate IDs
//   // if (!isValidObjectId(videoId) || !isValidObjectId(studentId)) {
//   //   throw new ApiError(400, "Invalid ID format");
//   // }

//   // Find student
//   const student = await Student.findById(studentId).select("name classGrade");
//   if (!student) {
//     throw new ApiError(404, "Student not found");
//   }

//   // Find or create attendance record for this video
//   let attendanceRecord = await YtVideoAttendance.findOne({ "video.id": videoId });

//   console.log("attendanceRecord", attendanceRecord)

//   if (!attendanceRecord) {
//     // Create new record if doesn't exist
//     attendanceRecord = new YtVideoAttendance({
//       video: { id: videoId },
//       student: []
//     });
//   }

//   // Check if student already marked attendance
//   const existingAttendance = attendanceRecord?.student?.find(
//     (s) => s.student.id.toString() === studentId
//   );

//   if (existingAttendance) {
//     throw new ApiError(400, "Attendance already marked");
//   }

//   // Add basic attendance record
//   attendanceRecord?.students?.push({
//     student: {
//       id: student._id,
//       name: student.name,
//       classGrade: student.classGrade
//     },
//     watchedAt: new Date()
//   });

//   await attendanceRecord.save();

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, { success: true }, "Attendance marked successfully")
//     );
// });
const markVideoAttendance = asyncHandler(async (req, res) => {
  const { videoId, studentId } = req.params;

  // Validate student exists
  const student = await Student.findById(studentId);
  console.log("student", student)
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // Find or create attendance record
  let attendance = await YtVideoAttendance.findOne({"video.id": videoId });
  console.log("attendance", attendance)

  // if (!attendance) {
  //   attendance = new YtVideoAttendance({
  //     video:{
  //       id:videoId},
  //     student: []
  //   });
  // }

  // Check if already attended
  if (attendance?.student?.some(s => s.id.toString() === student._id.toString())) {
    throw new ApiError(400, "Attendance already marked");
  }

  // Add student to array
  attendance?.student?.push({id:student._id,  classGrade:student.classGrade});
  await attendance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Attendance marked successfully"));
});


// const addVideoUrlToChapter = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const {
//     videoEmbededLink,
//     title,
//     description,
//     videoUrl,
//     videoSource,
//     author,
//   } = req.body;

//   if (!id) {
//     throw new ApiError(400, "Chapter ID is required");
//   }

//   if (!videoUrl || !title) {
//     throw new ApiError(400, "Video URL and Title are required");
//   }

//   const chapter = await Chapter.findById(id);
//   if (!chapter) {
//     throw new ApiError(404, "Chapter not found");
//   }

//   // Ensure chapter.videos is initialized as an array if it's undefined.
//   if (!chapter.videos) {
//     chapter.videos = [];
//   }

//   // Add the new video object to the videos array.
//   chapter.videos.push({
//     videoEmbededLink: videoEmbededLink,
//     title: title,
//     description: description,
//     videoUrl: videoUrl,
//     videoSource: videoSource,
//     author: author,
//     uploadDate: new Date(),
//     videoUploadedToSourceDate: new Date(),
//   });

//   const chapterData = await chapter.save();

//   res
//     .status(200)
//     .json(new ApiResponse(200, chapterData, "Successfully uploaded video data"));
// });

const getChapterById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Chapter ID is required");
  }
  const chapterDetails = await Chapter.findById(id);
  res
    .status(200)
    .json(
      new ApiResponse(200, chapterDetails, "Successfully Fetched Chapter data")
    );
});

const updateChapterById = asyncHandler(async (req, res) => {
  const { name, description, active } = req.body;
  if (!name || name.trim() === "" || name === null || name === undefined) {
    throw (400, new ApiError(400, null, "chapter name is required"));
  }
  const { id } = req.params;
  if (!id) {
    throw (400, new ApiError(400, null, "Chapter id is required"));
  }
  const chapterData = await Chapter.findById(id);
  if (!chapterData) {
    throw (400, new ApiError(400, null, "Not a valid chapter"));
  }

  (chapterData.name = name || chapterData.name),
    (chapterData.description = description || chapterData.description);
  chapterData.active = active || chapterData.active;

  const updatedData = await chapterData.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedData, "data updated successfully"));
});

const deleteChapterbyId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  if (!id) {
    throw (400, new ApiError(400, null, "Chapter id is required"));
  }
  console.log("request came here");
  const deletChapter = await Chapter.deleteOne({ _id: id });
  if (deletChapter?.deletedCount === 0) {
    throw (400, new ApiError(404, null, "Not a valid chapter ID"));
  }

  console.log("deletechapter", deletChapter);

  return res
    .status(200)
    .json(new ApiResponse(200, deletChapter, "Successfully deleted chapter"));
});

const getChapterYTVideos = asyncHandler(async (req, res) => {
  const { chapterId, videoId } = req.params;

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    return res.status(404).json({ message: "Chapter not found" });
  }

  const video = chapter.videos.find((v) => v._id.toString() === videoId);

  if (!video) {
    return res.status(404).json({ message: "Video not found in this chapter" });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "videos Successfully fetched"));
});

const updateChapterYtVideo = asyncHandler ( async (req, res)=>{
  const { chapterId, videoId } = req.params;
  const updateData = req.body; // Fields to be updated

  // 1️⃣ Find the chapter
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    return res.status(404).json({ message: "Chapter not found" });
  }

  // 2️⃣ Find the index of the video in the `videos` array
  const videoIndex = chapter.videos.findIndex((v) => v._id.toString() === videoId);

  if (videoIndex === -1) {
    return res.status(404).json({ message: "Video not found in this chapter" });
  }

  // 3️⃣ Update the video details (only provided fields)
  Object.keys(updateData).forEach((key) => {
    chapter.videos[videoIndex][key] = updateData[key];
  });

  // 4️⃣ Save the updated chapter
  await chapter.save();

  return res.status(200).json( new ApiResponse(200,  chapter.videos[videoIndex], "Successfully updated video details" ));


} )

const postAttenedenceYtVideos = asyncHandler(async(req, res)=>{
  const {
    student,
    class: classInfo,
    chapter,
    video,
    watchedAt,
    durationWatched,
    completed,
    watched,
  } = req.body;

  const existingAttendance = await YtVideoAttendance.findOne({
    "student.id": student.id,
    "video.id": video.id,
  });



  if (existingAttendance) {
    return res.status(400).json({ message: 'Attendance already marked for this video by this student.' });
  }

  // Create a new document using the YtVideoAttendance model
  const newAttendance = new YtVideoAttendance({
    student,
    class: classInfo,
    chapter,
    video,
    watchedAt,
    durationWatched,
    completed,
    watched,
  });

  // Save the document to the database
  await newAttendance.save();

  // Return success response
  res.status(201).json({ message: 'Attendance recorded successfully', data: newAttendance });

  });

  const getYtVideoAttendanceListbasedOnVid = asyncHandler (async(req, res)=>{
    const { videoId } = req.params; // Extract videoId from request parameters

    
      // Query attendance records based on the video ID
      const attendanceRecords = await YtVideoAttendance.find({ "video.id": videoId });
      console.log("attendanceRecords", attendanceRecords)
  
      // If no records found for the given video ID
      if (!attendanceRecords) {
        return res.status(404).json({ message: 'No attendance records found for this video.' });
      }
  
      // Return the attendance records for the given video ID
      res.status(200).json({ message: 'Attendance records found', data: attendanceRecords });
  })
  const checkStudentVideoAttendance = asyncHandler(async (req, res) => {
    const { videoId, studentId } = req.params;
  
    // Validate the input parameters
    if (!videoId || !studentId) {
      return res.status(400).json({
        message: 'Both videoId and studentId are required parameters'
      });
    }
  
    try {
      // Query attendance records for the specific video and student
      const attendanceRecord = await YtVideoAttendance.findOne({
        "video.id": videoId,
        "student.id": studentId
      });

      console.log("attendanceRecord", attendanceRecord)
  
      if (!attendanceRecord) {
        // No record found means student hasn't watched the video
        return res.status(200).json({
          message: 'Attendance record not found',
          watched: false,
          data: null
        });
      }
  
      // Return whether the student has watched the video
      res.status(200).json({
        message: 'Attendance record found',
        watched: true,
        data: {
          watchedAt: attendanceRecord.watchedAt,
          completed: attendanceRecord.completed,
          durationWatched: attendanceRecord.durationWatched
        }
      });
  
    } catch (error) {
      console.error('Error checking student video attendance:', error);
      res.status(500).json({
        message: 'Error checking attendance record',
        error: error.message
      });
    }
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
  getAllChapter,
  getAcademicYearDetails,
  addVideoUrlToChapter,
  getChapterById,
  updateChapterById,
  deleteChapterbyId,
  deleteClassById,
  deleteSubjectById,
  deleteAcademicyearById,
  getChapterYTVideos,
  updateChapterYtVideo,
  postAttenedenceYtVideos,
  getYtVideoAttendanceListbasedOnVid,
  markVideoAttendance,
  checkStudentVideoAttendance
};
