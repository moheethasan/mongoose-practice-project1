import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offeredCourse.service";

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered course is created successfully",
    data: result,
  });
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered courses are retrieved successfully",
    data: result,
  });
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course is retrieved successfully",
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.updateOfferedCourseInDB(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered course is updated successfully",
    data: result,
  });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered Course is deleted successfully",
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
