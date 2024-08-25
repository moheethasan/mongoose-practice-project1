import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async (userData: TLoginUser) => {
  //check if the user exists
  const isUserExists = await UserModel.isUserExistsByCustomId(userData.id);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exists!");
  }

  //check if user is deleted
  if (isUserExists.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted!");
  }

  //check if user is blocked
  if (isUserExists.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  //check the password
  if (
    !(await UserModel.isPasswordMatched(
      userData.password,
      isUserExists.password
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Wrong password!");
  }

  //if everything is fine then -> Access Granted (send AccessToken, RefreshToken)

  return "hello";
};

export const AuthServices = {
  loginUser,
};
