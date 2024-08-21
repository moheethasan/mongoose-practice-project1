import { Types } from "mongoose";
import { z } from "zod";
import { Days } from "./offeredCourse.constant";

const createOfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
      }),
    academicFaculty: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid ObjectId",
    }),
    academicDepartment: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
      }),
    course: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid ObjectId",
    }),
    faculty: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid ObjectId",
    }),
    maxCapacity: z.number().optional(),
    section: z.number(),
    days: z.array(z.enum(Days as [string, ...string[]])),
    startTime: z.string().regex(/^([01]?\d|2[0-3]):([0-5]\d)$/, {
      message: "Time must be in the HH:MM format",
    }),
    endTime: z.string().regex(/^([01]?\d|2[0-3]):([0-5]\d)$/, {
      message: "Time must be in the HH:MM format",
    }),
  }),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
      })
      .optional(),
    maxCapacity: z.number().optional(),
    section: z.number().optional(),
    days: z.array(z.enum(Days as [string, ...string[]])).optional(),
    startTime: z
      .string()
      .regex(/^([01]?\d|2[0-3]):([0-5]\d)$/, {
        message: "Time must be in the HH:MM format",
      })
      .optional(),
    endTime: z
      .string()
      .regex(/^([01]?\d|2[0-3]):([0-5]\d)$/, {
        message: "Time must be in the HH:MM format",
      })
      .optional(),
  }),
});

export const offeredCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
