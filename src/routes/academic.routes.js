import { Router } from "express";
import { getAllAcademicYear, createSubjects, createAcademicYear, createClass, getAllClass, getAllSubjects, createChapter, addNotesTochapter, getAcademicYearDetails, addVideoUrlToChapter, getAllChapter, getChapterById, updateChapterById, deleteChapterbyId, deleteClassById, deleteSubjectById, deleteAcademicyearById, getChapterYTVideos, updateChapterYtVideo, postAttenedenceYtVideos, getYtVideoAttendanceListbasedOnVid, markVideoAttendance, checkStudentVideoAttendance } from "../controllers/academic.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/academicYearBatch").post(createAcademicYear)
router.route("/academicYearBatch").get(getAllAcademicYear)
router.route("/academicYearBatch/:id").get(getAcademicYearDetails)
router.route("/academicYearBatch/:id").delete(deleteAcademicyearById)
// router.route("/academicYearBatch/:id").put(getAllAcademicYear)


router.route("/subject").post(createSubjects)
router.route("/subject").get(getAllSubjects)
router.route("/subject/:id").delete(deleteSubjectById)
router.route("/class").post(createClass)
router.route("/class").get(getAllClass)
router.route("/class/:id").delete(verifyJWT,deleteClassById)
router.route("/chapter").post(createChapter)
router.route("/chapter").get(verifyJWT, getAllChapter)
router.route("/chapter/:id").get(getChapterById)
router.route("/chapter/:id").put(updateChapterById)
router.route("/chapter/:id").delete(deleteChapterbyId)
router.route("/chapter/:id/notes").put(addNotesTochapter)
router.route("/chapter/:id/videoUrl").put(addVideoUrlToChapter)
router.route("/chapter/:chapterId/video/:videoId").get(getChapterYTVideos)
router.route("/chapter/:chapterId/video/:videoId").put(updateChapterYtVideo)
router.route("/chapter/:chapterId/video/:videoId/attendance").post(postAttenedenceYtVideos)
router.route("/video/:videoId/attendance").get(getYtVideoAttendanceListbasedOnVid)

//mark attendence
router.route("/video/:videoId/students/:studentId/attendance").post(markVideoAttendance)
router.route("/video/:videoId/student/:studentId/attendance").get(checkStudentVideoAttendance)






export default router