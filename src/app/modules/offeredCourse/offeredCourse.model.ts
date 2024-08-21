import { model, Schema } from "mongoose";
import { TOfferedCourse } from "./offeredCourse.interface";
import { Days } from "./offeredCourse.constant";

const offeredCourseSchema = new Schema<TOfferedCourse>({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: "SemesterRegistration",
    required: [true, "Semester Registration is required!"],
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    ref: "AcademicSemester",
    required: [true, "Academic Semester is required!"],
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: "AcademicFaculty",
    required: [true, "Academic Faculty is required!"],
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    ref: "AcademicDepartment",
    required: [true, "Academic Department is required!"],
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Course is required!"],
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: "Faculty",
    required: [true, "Faculty is required!"],
  },
  maxCapacity: {
    type: Number,
    default: 10,
  },
  section: {
    type: Number,
    required: true,
  },
  days: [
    {
      type: String,
      enum: Days,
    },
  ],
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

export const OfferedCourseModel = model<TOfferedCourse>(
  "OfferedCourse",
  offeredCourseSchema
);
