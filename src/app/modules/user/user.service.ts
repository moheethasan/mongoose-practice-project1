import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from "./user.utils";
import mongoose from "mongoose";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { TFaculty } from "../faculty/faculty.interface";
import { FacultyModel } from "../faculty/faculty.model";
import { TAdmin } from "../admin/admin.interface";
import { AdminModel } from "../admin/admin.model";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // Check if semester and department fields are present
  if (!studentData.admissionSemester || !studentData.academicDepartment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Academic Department and Admission Semester are required"
    );
  }

  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given then use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = "student";

  //find academic semester info
  const admissionSemester = await AcademicSemesterModel.findById(
    studentData.admissionSemester
  );
  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, "Admission semester not found!");
  }

  // check if academic department is there
  const academicDepartment = await AcademicDepartmentModel.findById(
    studentData.academicDepartment
  );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic department not found!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //set generated id
    userData.id = await generateStudentId(admissionSemester);

    //create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // userData was object before using transaction, now it's array

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user!");
    }

    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id;

    //create a student (transaction-2)
    const newStudent = await StudentModel.create([studentData], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student!");
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student!");
  }
};

const createFacultyIntoDB = async (password: string, facultyData: TFaculty) => {
  if (!facultyData.academicDepartment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Academic Department is required!"
    );
  }

  const academicDepartment = await AcademicDepartmentModel.findById(
    facultyData.academicDepartment
  );
  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Department not found!");
  }

  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = "faculty";

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateFacultyId();
    //create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user!");
    }

    facultyData.id = newUser[0].id;
    facultyData.user = newUser[0]._id;

    //create a student (transaction-2)
    const newFaculty = await FacultyModel.create([facultyData], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create faculty!");
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create faculty!");
  }
};

const createAdminIntoDB = async (password: string, adminData: TAdmin) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = "admin";

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateAdminId();
    //create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user!");
    }

    adminData.id = newUser[0].id;
    adminData.user = newUser[0]._id;

    //create a student (transaction-2)
    const newAdmin = await AdminModel.create([adminData], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin!");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin!");
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
