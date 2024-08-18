import mongoose from "mongoose";
import { z } from "zod";
import { BloodGroup, Gender } from "./faculty.constant";

const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: "first name can not be more than 20 characters" })
    .refine((value) => /^[A-Z][a-zA-Z]*$/.test(value), {
      message: "first name is not in capitalize format",
    }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "last name is required" }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: "first name can not be more than 20 characters" })
    .refine((value) => /^[A-Z][a-zA-Z]*$/.test(value), {
      message: "first name is not in capitalize format",
    })
    .optional(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "last name is required" }).optional(),
});

// Define Zod validation schema for the Faculty object

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    faculty: z.object({
      designation: z.string(),
      name: createUserNameValidationSchema,
      gender: z.enum(Gender as [string, ...string[]]),
      dateOfBirth: z.string().optional(),
      email: z.string().email({ message: "Email is not valid" }),
      contactNo: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z.enum(BloodGroup as [string, ...string[]]).optional(),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      academicDepartment: z
        .custom<mongoose.Types.ObjectId>()
        .refine((value) => value !== null, {
          message: "Academic Department is required",
        }),
      profileImg: z.string(),
    }),
  }),
});

// Define Zod validation schema for the Faculty object for update

const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z
      .object({
        designation: z.string().optional(),
        name: updateUserNameValidationSchema.optional(),
        gender: z.enum(Gender as [string, ...string[]]).optional(),
        dateOfBirth: z.string().optional(),
        email: z
          .string()
          .email({ message: "email is not a valid email" })
          .optional(),
        contactNo: z.string().min(1).optional(),
        emergencyContactNo: z.string().min(1).optional(),
        bloodGroup: z.enum(BloodGroup as [string, ...string[]]).optional(),
        presentAddress: z.string().min(1).optional(),
        permanentAddress: z.string().min(1).optional(),
        academicDepartment: z
          .custom<mongoose.Types.ObjectId>()
          .optional()
          .refine((value) => value !== null, {
            message: "Academic Department is required",
          })
          .optional(),
        profileImg: z.string().optional(),
      })
      .partial(), // Mark all fields in the Faculty object as optional
  }),
});

export const facultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
