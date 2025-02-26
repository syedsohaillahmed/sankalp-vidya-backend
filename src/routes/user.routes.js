import { Router } from "express";
import  {registerUser, createUserRoles, getUserRoles, loginUser, logoutUser, updateStudentDetails, getUserDetails } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
    next();
  });

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

router.route("/useriood").get(verifyJWT,getUserDetails)

router.route("/test").get((req, res) => {
    console.log("Test route hit!");
    res.status(200).json({ message: "Hello" });
  });

router.route("/student/:id").patch( updateStudentDetails);  // Update student details by ID


export default router