import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { SemesterRegistrationModel } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourseModel } from "./offeredCourse.model";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import { CourseModel } from "../course/course.model";
import { FacultyModel } from "../faculty/faculty.model";
import { hasTimeConflict } from "./offeredCourse.utils";
import { semesterRegistrationStatus } from "../semesterRegistration/semesterRegistration.constant";
import QueryBuilder from "../../builder/QueryBuilder";

const createOfferedCourseIntoDB = async (offeredCourseData: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
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

  //get the schedule of the faculty
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Faculty is not available at this time! Choose another day or time."
    );
  }
  offeredCourseData.academicSemester =
    isSemesterRegistrationExists.academicSemester;

  const result = await OfferedCourseModel.create(offeredCourseData);
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(
    OfferedCourseModel.find()
      .populate({
        path: "semesterRegistration",
        populate: {
          path: "academicSemester",
        },
      })
      .populate("academicSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      })
      .populate("academicFaculty")
      .populate("course")
      .populate("faculty"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .limit()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourseModel.findById(id)
    .populate({
      path: "semesterRegistration",
      populate: {
        path: "academicSemester",
      },
    })
    .populate("academicSemester")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    })
    .populate("academicFaculty")
    .populate("course")
    .populate("faculty");
  return result;
};

const updateOfferedCourseInDB = async (
  id: string,
  updatedOfferedCourseData: Pick<
    TOfferedCourse,
    "faculty" | "maxCapacity" | "days" | "startTime" | "endTime"
  >
) => {
  const { faculty, days, startTime, endTime } = updatedOfferedCourseData;

  const isOfferedCourseExists = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!");
  }

  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!");
  }

  //get the schedule of the faculty
  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  //semester registration status should be UPCOMING
  const registrationStatus = await SemesterRegistrationModel.findById(
    semesterRegistration
  ).select("status");
  if (registrationStatus?.status !== semesterRegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't update this offered course as it is ${registrationStatus?.status}`
    );
  }

  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");
  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Faculty is not available at this time! Choose another day or time."
    );
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(
    id,
    updatedOfferedCourseData,
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!");
  }

  const registrationStatus = await SemesterRegistrationModel.findById(
    isOfferedCourseExists.semesterRegistration
  ).select("status");
  if (registrationStatus?.status !== semesterRegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't delete this offered course as it is ${registrationStatus?.status}`
    );
  }

  const result = await OfferedCourseModel.findByIdAndDelete(id);
  return result;
};

//task---> semester registration - delete when upcoming and delete offered course first then delete semester registration.

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseInDB,
  deleteOfferedCourseFromDB,
};
