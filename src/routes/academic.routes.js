import { Router } from "express";
import { getAllAcademicYear, addSubjects, createAcademicYear, createClass, getAllClass, getAllSubjects } from "../controllers/academic.controller.js";


const router = Router()

router.route("/academicYearBatch").post(createAcademicYear)
router.route("/academicYearBatch").get(getAllAcademicYear)
router.route("/subject").post(addSubjects)
router.route("/subject").get(getAllSubjects)
router.route("/class").post(createClass)
router.route("/class").get(getAllClass)



export default router