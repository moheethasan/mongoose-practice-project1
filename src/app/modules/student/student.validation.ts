import mongoose from "mongoose";
import { z } from "zod";

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
      user: z.custom<mongoose.Types.ObjectId>(),
      name: createUserNameValidationSchema,
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
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      admissionSemester: z
        .custom<mongoose.Types.ObjectId>()
        .refine((value) => value !== null, {
          message: "Admission Semester is required",
        }),
      academicDepartment: z
        .custom<mongoose.Types.ObjectId>()
        .refine((value) => value !== null, {
          message: "Academic Department is required",
        }),
      profileImg: z.string(),
    }),
  }),
});

// Define Zod validation schema for the Student object for update

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z
      .object({
        user: z.custom<mongoose.Types.ObjectId>().optional(),
        name: updateUserNameValidationSchema.optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        dateOfBirth: z.string().optional(),
        email: z
          .string()
          .email({ message: "email is not a valid email" })
          .optional(),
        contactNo: z.string().min(1).optional(),
        emergencyContactNo: z.string().min(1).optional(),
        bloodGroup: z
          .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
          .optional(),
        presentAddress: z.string().min(1).optional(),
        permanentAddress: z.string().min(1).optional(),
        guardian: updateGuardianValidationSchema.optional(),
        localGuardian: updateLocalGuardianValidationSchema.optional(),
        admissionSemester: z
          .custom<mongoose.Types.ObjectId>()
          .optional()
          .refine((value) => value !== null, {
            message: "Admission Semester is required",
          })
          .optional(),
        academicDepartment: z
          .custom<mongoose.Types.ObjectId>()
          .optional()
          .refine((value) => value !== null, {
            message: "Academic Department is required",
          })
          .optional(),
        profileImg: z.string().optional(),
      })
      .partial(), // Mark all fields in the student object as optional
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
