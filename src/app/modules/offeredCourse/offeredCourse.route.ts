import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { offeredCourseValidations } from "./offeredCourse.validation";
import { OfferedCourseControllers } from "./offeredCourse.controller";

const router = express.Router();

router.post(
  "/create-offered-course",
  validateRequest(offeredCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse
);

router.get("/", OfferedCourseControllers.getAllOfferedCourses);

router.get("/:id", OfferedCourseControllers.getSingleOfferedCourse);

router.patch(
  "/:id",
  validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse
);

router.delete("/:id", OfferedCourseControllers.deleteOfferedCourse);

export const OfferedCourseRoutes = router;
