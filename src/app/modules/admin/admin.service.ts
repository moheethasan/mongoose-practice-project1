import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { UserModel } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { AdminModel } from "./admin.model";
import { adminSearchableFields } from "./admin.constant";
import { TAdmin } from "./admin.interface";

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(AdminModel.find().populate("user"), query)
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .limit()
    .fields();

  const result = await adminQuery.modelQuery;
  return result;
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await AdminModel.findById(id).populate("user");
  return result;
};

const updateAdminInDB = async (
  id: string,
  updatedAdminData: Partial<TAdmin>
) => {
  const admin = await AdminModel.isAdminExists(id);
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin does not exists!");
  }

  const { name, ...remainingAdminData } = updatedAdminData;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await AdminModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  });
  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const admin = await AdminModel.isAdminExists(id);
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin does not exists!");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAdmin = await AdminModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete admin!");
    }

    // get user _id from deletedAdmin
    const userId = deletedAdmin.user;

    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user!");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete admin!");
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminInDB,
  deleteAdminFromDB,
};
