import { Router } from "express";
import { addSubjects, createClass, getAllClass, getAllSubjects } from "../controllers/academic.controller.js";


const router = Router()

router.route("/subject").post(addSubjects)
router.route("/subject").get(getAllSubjects)
router.route("/class").post(createClass)
router.route("/class").get(getAllClass)



export default router