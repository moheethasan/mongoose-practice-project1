import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { UserModel } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { FacultyModel } from "./faculty.model";
import { facultySearchableFields } from "./faculty.constant";
import { TFaculty } from "./faculty.interface";

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    FacultyModel.find()
      .populate("user")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      }),
    query
  )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .limit()
    .fields();

  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await FacultyModel.findById(id)
    .populate("user")
    .populate({
      path: "academicDepartment",
      populate: {
        path: "academicFaculty",
      },
    });
  return result;
};

const updateFacultyInDB = async (
  id: string,
  updatedFacultyData: Partial<TFaculty>
) => {
  const faculty = await FacultyModel.isFacultyExists(id);
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty does not exists!");
  }

  const { name, ...remainingFacultyData } = updatedFacultyData;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await FacultyModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  });
  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const faculty = await FacultyModel.isFacultyExists(id);
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty does not exists!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedFaculty = await FacultyModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete faculty!");
    }

    const deletedUser = await UserModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user!");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete faculty!");
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyInDB,
  deleteFacultyFromDB,
};
