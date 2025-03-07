import { Router } from "express";
import { getAllAcademicYear, createSubjects, createAcademicYear, createClass, getAllClass, getAllSubjects, createChapter, addNotesTochapter, getAcademicYearDetails, addVideoUrlToChapter, getAllChapter, getChapterById, updateChapterById, deleteChapterbyId } from "../controllers/academic.controller.js";


const router = Router()

router.route("/academicYearBatch").post(createAcademicYear)
router.route("/academicYearBatch").get(getAllAcademicYear)
router.route("/academicYearBatch/:id").get(getAcademicYearDetails)
// router.route("/academicYearBatch/:id").put(getAllAcademicYear)


router.route("/subject").post(createSubjects)
router.route("/subject").get(getAllSubjects)
router.route("/class").post(createClass)
router.route("/class").get(getAllClass)
router.route("/chapter").post(createChapter)
router.route("/chapter").get(getAllChapter)
router.route("/chapter/:id").get(getChapterById)
router.route("/chapter/:id").put(updateChapterById)
router.route("/chapter/:id").delete(deleteChapterbyId)
router.route("/chapter/:id/notes").put(addNotesTochapter)
router.route("/chapter/:id/videoUrl").put(addVideoUrlToChapter)



export default router