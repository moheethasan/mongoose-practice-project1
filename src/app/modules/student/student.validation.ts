import mongoose from "mongoose";
import { z } from "zod";

// Define Zod validation schemas for the nested objects first

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: "first name can not be more than 20 characters" })
    .refine((value) => /^[A-Z][a-zA-Z]*$/.test(value), {
      message: "first name is not in capitalize format",
    }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "last name is required" }),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().min(1),
  fatherOccupation: z.string().min(1),
  fatherContactNo: z.string().min(1),
  motherName: z.string().min(1),
  motherOccupation: z.string().min(1),
  motherContactNo: z.string().min(1),
});

const localGuardianValidationSchema = z.object({
  name: z
    .string()
    .max(20, { message: "password can not be more than 20 characters" })
    .min(1),
  occupation: z.string().min(1),
  contact: z.string().min(1),
  address: z.string().min(1),
});

// Define Zod validation schema for the Student object

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      user: z.custom<mongoose.Types.ObjectId>(),
      name: userNameValidationSchema,
      gender: z.enum(["male", "female", "other"]),
      dateOfBirth: z.string().optional(),
      email: z.string().email({ message: "email is not a valid email" }),
      contactNo: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.custom<mongoose.Types.ObjectId>(),
      profileImg: z.string(),
    }),
  }),
});

export const studentValidations = { createStudentValidationSchema };
