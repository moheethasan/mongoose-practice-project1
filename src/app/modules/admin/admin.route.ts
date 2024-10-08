import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminControllers } from "./admin.controller";
import { adminValidations } from "./admin.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

// call controller function
router.get("/", auth(), AdminControllers.getAllAdmins);

router.get("/:id", AdminControllers.getSingleAdmin);

router.patch(
  "/:id",
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin
);

router.delete("/:id", AdminControllers.deleteAdmin);

export const AdminRoutes = router;
