import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interface/error";

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleCastError;
