import { Types } from "mongoose";
import { z } from "zod";
import { Days } from "./offeredCourse.constant";

const timeStringSchema = z.string().regex(/^([01]?\d|2[0-3]):([0-5]\d)$/, {
  message: "Time must be in the HH:MM format",
});

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
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
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return end > start;
      },
      { message: "endTime must be greater than startTime" }
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
      }),
      maxCapacity: z.number(),
      days: z.array(z.enum(Days as [string, ...string[]])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return end > start;
      },
      { message: "endTime must be greater than startTime" }
    ),
});

export const offeredCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
