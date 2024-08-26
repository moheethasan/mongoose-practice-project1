import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";

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
  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10d",
  });

  return {
    accessToken,
    needsPasswordChange: isUserExists.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  passwordData: { oldPassword: string; newPassword: string }
) => {
  //check if the user exists
  const isUserExists = await UserModel.isUserExistsByCustomId(userData.userId);
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
      passwordData.oldPassword,
      isUserExists.password
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Wrong password!");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    passwordData.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await UserModel.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );
  return null;
};

export const AuthServices = {
  loginUser,
  changePassword,
};
