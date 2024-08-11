import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFacultyModel } from "./academicFaculty.model";

const createAcademicFacultyIntoDB = async (
  academicFacultyData: TAcademicFaculty
) => {
  const result = await AcademicFacultyModel.create(academicFacultyData);
  return result;
};

const getAllAcademicFacultiesFromDB = async () => {
  const result = await AcademicFacultyModel.find();
  return result;
};

const getAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFacultyModel.findById(id);
  return result;
};

const updateAcademicFacultyInDB = async (
  id: string,
  updatedAcademicFacultyData: Partial<TAcademicFaculty>
) => {
  const result = await AcademicFacultyModel.findByIdAndUpdate(
    id,
    updatedAcademicFacultyData,
    { new: true }
  );
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getAcademicFacultyFromDB,
  updateAcademicFacultyInDB,
};
