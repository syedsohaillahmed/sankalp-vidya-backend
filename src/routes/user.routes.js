import { Router } from "express";
import  {registerUser, createUserRoles, getUserRoles, loginUser, logoutUser, updateStudentDetails } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        }
    ])
    ,registerUser)
router.route("/userRole").post(createUserRoles)
router.route("/userRole").get(getUserRoles)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)


router.route("/student/:id").patch( updateStudentDetails);  // Update student details by ID


export default router