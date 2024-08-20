import { Types } from "mongoose";
import { z } from "zod";
import { BloodGroup, Gender } from "./student.constant";

// Define Zod validation schemas for the nested objects first

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

const createGuardianValidationSchema = z.object({
  fatherName: z.string().min(1),
  fatherOccupation: z.string().min(1),
  fatherContactNo: z.string().min(1),
  motherName: z.string().min(1),
  motherOccupation: z.string().min(1),
  motherContactNo: z.string().min(1),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().min(1).optional(),
  fatherOccupation: z.string().min(1).optional(),
  fatherContactNo: z.string().min(1).optional(),
  motherName: z.string().min(1).optional(),
  motherOccupation: z.string().min(1).optional(),
  motherContactNo: z.string().min(1).optional(),
});

const createLocalGuardianValidationSchema = z.object({
  name: z
    .string()
    .max(20, { message: "password can not be more than 20 characters" })
    .min(1),
  occupation: z.string().min(1),
  contact: z.string().min(1),
  address: z.string().min(1),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z
    .string()
    .max(20, { message: "password can not be more than 20 characters" })
    .min(1)
    .optional(),
  occupation: z.string().min(1).optional(),
  contact: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
});

// Define Zod validation schema for the Student object

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(Gender as [string, ...string[]]),
      dateOfBirth: z.string().optional(),
      email: z.string().email({ message: "Email is not valid" }),
      contactNo: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z.enum(BloodGroup as [string, ...string[]]).optional(),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      admissionSemester: z
        .string()
        .refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid ObjectId",
        }),
      academicDepartment: z
        .string()
        .refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid ObjectId",
        }),
      profileImg: z.string(),
    }),
  }),
});

// Define Zod validation schema for the Student object for update

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
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
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admissionSemester: z
        .string()
        .refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid ObjectId",
        })
        .optional(),
      academicDepartment: z
        .string()
        .refine((val) => Types.ObjectId.isValid(val), {
          message: "Invalid ObjectId",
        })
        .optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
