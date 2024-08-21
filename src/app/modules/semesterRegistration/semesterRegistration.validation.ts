import { Types } from "mongoose";
import { z } from "zod";
import { Status } from "./semesterRegistration.constant";

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid ObjectId",
    }),
    status: z.enum(Status as [string, ...string[]]).optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
      })
      .optional(),
    status: z.enum(Status as [string, ...string[]]).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

export const semesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
