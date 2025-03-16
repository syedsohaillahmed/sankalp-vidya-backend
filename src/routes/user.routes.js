import { Router } from "express";
import {
  registerUser,
  createUserRoles,
  getUserRoles,
  loginUser,
  logoutUser,
  updateStudentDetails,
  getUserDetails,
  updateUserRoleById,
  updateUserDetailsById,
  getUsers,
  getStudentsList,
  registerStudents,
  getStudentDetails,
  deleteStudent,
  checkEmailExists,
  checkPhoneNoExists,
  checkUserNameExists,
  checkStudentrollNoExists,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/userRole").post(createUserRoles);
router.route("/userRole").get(getUserRoles);
router.route("/userRole/:id").put(updateUserRoleById);


router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

//get userslit
router.route("/userList").get(verifyJWT, getUsers)
router.route("/user/emailexist").get(checkEmailExists)
router.route("/user/usernameexist").get(checkUserNameExists)
router.route("/user/availablePhone").get(checkPhoneNoExists);

//get data based on userid
router.route("/user/:id").get(verifyJWT,getUserDetails);
router.route("/user/:id").put(verifyJWT,updateUserDetailsById);
router.route("/student").get(verifyJWT, getStudentsList)
router.route("/student").post( upload.fields([
  {
    name: "avatar",
    maxCount: 1,
  },
]), registerStudents)
router.route("/student/rollnoexists").get(checkStudentrollNoExists)
router.route("/student/:id").patch(updateStudentDetails); // Update student details by ID
router.route("/student/:id").get(getStudentDetails); // Update student details by ID
router.route("/student/:id").delete(deleteStudent);
export default router;
