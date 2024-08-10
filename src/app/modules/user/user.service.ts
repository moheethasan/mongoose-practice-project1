import config from "../../config";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import { generateStudentId } from "./user.utils";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
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

  //set manually generated id
  if (!admissionSemester) {
    throw new Error("Admission semester not found!");
  }
  // FIX THE ISSUE OF ID
  userData.id = await generateStudentId(admissionSemester);

  //create a user
  const result = await UserModel.create(userData);

  //create a student
  if (Object.keys(result).length) {
    studentData.id = result.id;
    studentData.user = result._id;

    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  }

  return result;
};

export const UserServices = {
  createStudentIntoDB,
};
