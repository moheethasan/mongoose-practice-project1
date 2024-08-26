import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { studentValidations } from "../student/student.validation";
import { facultyValidations } from "../faculty/faculty.validation";
import { adminValidations } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { userRole } from "./user.constant";

const router = express.Router();

router.post(
  "/create-student",
  auth(userRole.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent
);

router.post(
  "/create-faculty",
  auth(userRole.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty
);

router.post(
  "/create-admin",
  // auth(userRole.admin),
  validateRequest(adminValidations.createAdminValidationSchema),
  UserControllers.createAdmin
);

export const UserRoutes = router;
