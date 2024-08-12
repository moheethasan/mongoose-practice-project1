import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  // call service function to send the data
  const result = await UserServices.createStudentIntoDB(password, studentData);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student!");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "student is created successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
};
