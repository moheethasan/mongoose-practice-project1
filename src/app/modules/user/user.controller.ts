import { NextFunction, Request, Response } from "express";
import { studentValidationSchema } from "../student/student.validation";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, student: studentData } = req.body;

    // data validation using zod
    const zodParsedData = studentValidationSchema.parse(studentData);

    // call service function to send the data
    const result = await UserServices.createStudentIntoDB(
      password,
      zodParsedData
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "student is created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const UserControllers = {
  createStudent,
};
