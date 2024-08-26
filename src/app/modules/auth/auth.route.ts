import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../user/user.constant";

const router = express.Router();

router.post(
  "/login",
  validateRequest(authValidations.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/change-password",
  auth(userRole.student, userRole.faculty, userRole.admin),
  validateRequest(authValidations.changePasswordValidationSchema),
  AuthControllers.changePassword
);

export const AuthRoutes = router;
