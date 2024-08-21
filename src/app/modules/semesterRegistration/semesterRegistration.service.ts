import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistrationModel } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { semesterRegistrationStatus } from "./semesterRegistration.constant";

const createSemesterRegistrationIntoDB = async (
  semesterRegistrationData: TSemesterRegistration
) => {
  const academicSemester = semesterRegistrationData?.academicSemester;

  //check if 'UPCOMING' | 'ONGOING' semester available
  const isSemesterUpcomingOrOngoing = await SemesterRegistrationModel.findOne({
    $or: [
      { status: semesterRegistrationStatus.UPCOMING },
      { status: semesterRegistrationStatus.ONGOING },
    ],
  });
  if (isSemesterUpcomingOrOngoing) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There's already an ${isSemesterUpcomingOrOngoing.status} semester registered!`
    );
  }

  //check if academic semester is valid
  const isAcademicSemesterExists = await AcademicSemesterModel.findById(
    academicSemester
  );
  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester not found!");
  }

  //check if semester already registered
  const isSemesterRegistrationExists = await SemesterRegistrationModel.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(httpStatus.CONFLICT, "Semester already registered!");
  }

  const result = SemesterRegistrationModel.create(semesterRegistrationData);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate("academicSemester"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .limit()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistrationModel.findById(id).populate(
    "academicSemester"
  );
  return result;
};

const updateSemesterRegistrationInDB = async (
  id: string,
  updatedSemesterRegistrationData: Partial<TSemesterRegistration>
) => {
  //check if semester is registered or not
  const requestedSemesterRegistration =
    await SemesterRegistrationModel.findById(id);
  if (!requestedSemesterRegistration) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Semester registration does'nt exists!"
    );
  }

  //if requested semester registration status is "ENDED", we won't update semester registration
  if (
    requestedSemesterRegistration.status === semesterRegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Semester registration already ${requestedSemesterRegistration.status}!`
    );
  }

  if (
    requestedSemesterRegistration.status ===
      semesterRegistrationStatus.UPCOMING &&
    updatedSemesterRegistrationData.status === semesterRegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Can't change semester registration status from ${requestedSemesterRegistration.status} to ${updatedSemesterRegistrationData.status} directly!`
    );
  }

  if (
    requestedSemesterRegistration.status ===
      semesterRegistrationStatus.ONGOING &&
    updatedSemesterRegistrationData.status ===
      semesterRegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Can't change semester registration status from ${requestedSemesterRegistration.status} to ${updatedSemesterRegistrationData.status} directly!`
    );
  }

  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    updatedSemesterRegistrationData,
    { new: true, runValidators: true }
  );
  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationInDB,
};
