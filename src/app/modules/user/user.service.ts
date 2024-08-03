import config from "../../config";
import { TStudent } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  //create a user object
  const userData: Partial<TUser> = {};

  //if password is not given then use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = "student";

  //set manually generated id
  userData.id = "2030100001";

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
