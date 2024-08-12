import mongoose from "mongoose";
import { z } from "zod";

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "Academic department should be a string!",
    }),
    academicFaculty: z.custom<mongoose.Types.ObjectId>(),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Academic department should be a string!",
      })
      .optional(),
    academicFaculty: z.custom<mongoose.Types.ObjectId>().optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
