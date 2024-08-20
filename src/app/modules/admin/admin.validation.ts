import { z } from "zod";
import { BloodGroup, Gender } from "./admin.constant";

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

// Define Zod validation schema for the Admin object

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    admin: z.object({
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
      profileImg: z.string(),
    }),
  }),
});

// Define Zod validation schema for the Admin object for update

const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
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
      profileImg: z.string().optional(),
    }),
  }),
});

export const adminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
