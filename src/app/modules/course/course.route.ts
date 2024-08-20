import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseControllers } from "./course.controller";
import { courseValidations } from "./course.validation";

const router = express.Router();

// call controller function
router.post(
  "/create-course",
  validateRequest(courseValidations.createCourseValidationSchema),
  CourseControllers.createCourse
);

router.get("/", CourseControllers.getAllCourses);

router.get("/:id", CourseControllers.getSingleCourse);

router.patch(
  "/:id",
  validateRequest(courseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse
);

router.put(
  "/:courseId/assign-faculties",
  validateRequest(courseValidations.courseFacultyValidationSchema),
  CourseControllers.assignCourseFaculties
);

router.delete(
  "/:courseId/remove-faculties",
  validateRequest(courseValidations.courseFacultyValidationSchema),
  CourseControllers.removeCourseFaculties
);

router.delete("/:id", CourseControllers.deleteCourse);

export const CourseRoutes = router;
