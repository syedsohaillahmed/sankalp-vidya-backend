import { Router } from "express";
import {registerUser, createUserRoles, getUserRoles } from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

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

export default router