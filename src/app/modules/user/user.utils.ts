import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { UserModel } from "./user.model";

const findLastUserId = async (role: string) => {
  const lastUser = await UserModel.findOne(
    {
      role: role,
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastUser?.id ? lastUser.id : undefined;
};

//year semester code 4 digit number
export const generateStudentId = async (
  academicSemesterData: TAcademicSemester
) => {
  let currentId = (0).toString(); //default id
  const lastStudentId = await findLastUserId("student");
  // 2030 01 0001
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentYear = lastStudentId?.substring(0, 4);
  const currentSemesterCode = academicSemesterData.code;
  const currentYear = academicSemesterData.year;
  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `${academicSemesterData.year}${academicSemesterData.code}${incrementId}`;
  return incrementId;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString(); //default id
  const lastFacultyId = await findLastUserId("faculty");
  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `F-${incrementId}`;
  return incrementId;
};

export const generateAdminId = async () => {
  let currentId = (0).toString(); //default id
  const lastAdminId = await findLastUserId("admin");
  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `A-${incrementId}`;
  return incrementId;
};
