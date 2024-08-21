import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistrationModel } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourseModel } from "./offeredCourse.model";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import { CourseModel } from "../course/course.model";
import { FacultyModel } from "../faculty/faculty.model";

const createOfferedCourseIntoDB = async (offeredCourseData: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
  } = offeredCourseData;

  //apply validations
  const isSemesterRegistrationExists = await SemesterRegistrationModel.findById(
    semesterRegistration
  );
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester registration not found!"
    );
  }
  const isAcademicFacultyExists = await AcademicFacultyModel.findById(
    academicFaculty
  );
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic faculty not found!");
  }
  const isAcademicDepartmentExists = await AcademicDepartmentModel.findById(
    academicDepartment
  );
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic department not found!");
  }
  //is the department belong to the faculty
  if (
    isAcademicDepartmentExists.academicFaculty.toString() !==
    isAcademicFacultyExists._id.toString()
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isAcademicDepartmentExists.name} doesn't belong to ${isAcademicFacultyExists.name}!`
    );
  }
  const isCourseExists = await CourseModel.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found!");
  }
  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!");
  }
  //check if the section of offered course are same
  const isSameSection = await OfferedCourseModel.findOne({
    semesterRegistration,
    course,
    section,
  });
  if (isSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Offered course with same section already exists!"
    );
  }

  offeredCourseData.academicSemester =
    isSemesterRegistrationExists.academicSemester;

  const result = await OfferedCourseModel.create(offeredCourseData);
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
};
