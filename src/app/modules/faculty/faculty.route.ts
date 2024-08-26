import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidations } from "./faculty.validation";
import { FacultyControllers } from "./faculty.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../user/user.constant";

const router = express.Router();

// call controller function
router.get(
  "/",
  auth(userRole.admin, userRole.faculty),
  FacultyControllers.getAllFaculties
);

router.get("/:id", FacultyControllers.getSingleFaculty);

router.patch(
  "/:id",
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);

router.delete("/:id", FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
