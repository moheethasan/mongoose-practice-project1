import { Schema, model } from "mongoose";
import {
  StudentCustomModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from "./student.interface";
import validator from "validator";
import { BloodGroup, Gender } from "./student.constant";
// import AppError from "../../errors/AppError";
// import httpStatus from "http-status";

// create schema

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, "first name is required"],
    maxlength: [20, "first name can not be more than 20 characters"],
    trim: true,
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: "{VALUE} is not in capitalize format",
    },
  },
  middleName: { type: String },
  lastName: { type: String, required: [true, "last name is required"] },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, StudentCustomModel>(
  {
    id: { type: String, required: [true, "ID is required!"], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required!"],
      unique: true,
      ref: "User",
    },
    name: {
      type: userNameSchema,
      required: [true, "Name is required!"],
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: "{VALUE} is not valid gender",
      },
      required: true,
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "{VALUE} is not an valid email",
      },
    },
    contactNo: {
      type: String,
      required: [true, "Contact number is required!"],
    },
    emergencyContactNo: {
      type: String,
      required: [true, "Emergency contact number is required"],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroup,
        message: "{VALUE} is not a valid blood group",
      },
    },
    presentAddress: {
      type: String,
      required: [true, "Present address is required"],
    },
    permanentAddress: {
      type: String,
      required: [true, "Permanent address is required"],
    },
    guardian: {
      type: guardianSchema,
      required: [true, "Guardian information is required"],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, "Local guardian information is required"],
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      required: [true, "Admission Semester is required"],
      ref: "AcademicSemester",
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, "Academic Department is required"],
      ref: "AcademicDepartment",
    },
    profileImg: { type: String },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// ---> virtual <---
studentSchema.virtual("fullName").get(function () {
  return `${this.name?.firstName} ${this.name?.middleName} ${this.name?.lastName}`;
});

// ---> Query middleware <---

studentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//didn't worked

// studentSchema.pre("findOneAndUpdate", async function (next) {
//   const query = this.getQuery();

//   const isStudentExists = await StudentModel.findOne({ query });
//   if (!isStudentExists) {
//     throw new AppError(httpStatus.NOT_FOUND, "Student does not exists!");
//   }
//   next();
// });

// studentSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
//   next();
// });

// for static method
studentSchema.statics.isStudentExists = async function (id: string) {
  const existingStudent = await StudentModel.findById(id);
  return existingStudent;
};

// for instance method
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await StudentModel.findOne({ id });
//   return existingUser;
// };

// create model
export const StudentModel = model<TStudent, StudentCustomModel>(
  "Student",
  studentSchema
);
