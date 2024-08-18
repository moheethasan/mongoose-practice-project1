import { model, Schema } from "mongoose";
import { FacultyCustomModel, TFaculty, TUserName } from "./faculty.interface";
import { BloodGroup, Gender } from "./faculty.constant";
import validator from "validator";

const userNameSchema = new Schema<TUserName, FacultyCustomModel>({
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

export const facultySchema = new Schema<TFaculty>(
  {
    id: { type: String, required: [true, "ID is required!"], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required!"],
      unique: true,
      ref: "User",
    },
    designation: { type: String, required: [true, "Designation is required!"] },
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

facultySchema.virtual("fullName").get(function () {
  return `${this.name?.firstName} ${this.name?.middleName} ${this.name?.lastName}`;
});

facultySchema.statics.isFacultyExists = async function (id: string) {
  const existingFaculty = await FacultyModel.findOne({ id });
  return existingFaculty;
};

export const FacultyModel = model<TFaculty, FacultyCustomModel>(
  "Faculty",
  facultySchema
);
