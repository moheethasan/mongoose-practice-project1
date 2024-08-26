import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { UserModel } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    //check if client sent any token
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    //check if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { userId, role, iat } = decoded;

    //check if the user exists
    const isUserExists = await UserModel.isUserExistsByCustomId(userId);
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

    if (
      isUserExists.passwordChangedAt &&
      (await UserModel.isJwtIssuedBeforePasswordChanged(
        isUserExists.passwordChangedAt,
        iat as number
      ))
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }
    req.user = decoded;
    next();
  });
};

export default auth;
