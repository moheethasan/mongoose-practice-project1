import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    //check if client sent any token
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    //check if the token is valid
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (error, decoded) {
        if (error) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized!"
          );
        }

        if (
          requiredRoles &&
          !requiredRoles.includes((decoded as JwtPayload).role)
        ) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "You are not authorized!"
          );
        }
        req.user = decoded as JwtPayload;
        next();
      }
    );
  });
};

export default auth;
