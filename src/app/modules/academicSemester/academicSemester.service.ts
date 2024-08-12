import httpStatus from "http-status";
import { academicSemesterNameCodeMapper } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterModel } from "./academicSemester.model";
import AppError from "../../errors/AppError";

const createAcademicSemesterIntoDB = async (
  academicSemesterData: TAcademicSemester
) => {
  if (
    academicSemesterNameCodeMapper[academicSemesterData.name] !==
    academicSemesterData.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid semester code!");
  }

  const result = await AcademicSemesterModel.create(academicSemesterData);
  return result;
};

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemesterModel.find();
  return result;
};

const getAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemesterModel.findById(id);
  return result;
};

const updateAcademicSemesterInDB = async (
  id: string,
  updatedAcademicSemesterData: Partial<TAcademicSemester>
) => {
  if (
    updatedAcademicSemesterData.name &&
    updatedAcademicSemesterData.code &&
    academicSemesterNameCodeMapper[updatedAcademicSemesterData.name] !==
      updatedAcademicSemesterData.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid semester code!");
  }

  const result = await AcademicSemesterModel.findByIdAndUpdate(
    id,
    updatedAcademicSemesterData,
    { new: true }
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getAcademicSemesterFromDB,
  updateAcademicSemesterInDB,
};
