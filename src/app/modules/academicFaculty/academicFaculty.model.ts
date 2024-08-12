import { model, Schema } from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

academicFacultySchema.pre("save", async function (next) {
  const isFacultyExists = await AcademicFacultyModel.findOne({
    name: this.name,
  });
  if (isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty already exists!");
  }
  next();
});

academicFacultySchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();

  const isFacultyExists = await AcademicFacultyModel.findOne({
    query,
  });
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty does not exists!");
  }
  next();
});

export const AcademicFacultyModel = model<TAcademicFaculty>(
  "AcademicFaculty",
  academicFacultySchema
);
