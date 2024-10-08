import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import { AcademicFacultyValidations } from "./academicFaculty.validation";

const router = express.Router();

// call controller function
router.get("/", AcademicFacultyControllers.getAllAcademicFaculties);

router.get("/:facultyId", AcademicFacultyControllers.getSingleAcademicFaculty);

router.post(
  "/create-academic-faculty",
  validateRequest(
    AcademicFacultyValidations.createAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.createAcademicFaculty
);

router.patch(
  "/:facultyId",
  validateRequest(
    AcademicFacultyValidations.updateAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.updateAcademicFaculty
);

export const AcademicFacultyRoutes = router;
