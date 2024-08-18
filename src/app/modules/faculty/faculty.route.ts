import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { facultyValidations } from "./faculty.validation";
import { FacultyControllers } from "./faculty.controller";

const router = express.Router();

// call controller function
router.get("/", FacultyControllers.getAllFaculties);

router.get("/:facultyId", FacultyControllers.getSingleFaculty);

router.patch(
  "/:facultyId",
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);

router.delete("/:facultyId", FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
