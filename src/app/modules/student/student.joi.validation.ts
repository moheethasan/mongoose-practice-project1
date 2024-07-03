import Joi from "joi";

// Define Joi validation schemas for the nested objects first

const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .max(20)
    .trim()
    .regex(/^[A-Z][a-zA-Z]*$/)
    .required()
    .messages({
      "string.max": "first name can not be more than 20 characters",
      "string.pattern.base": "{#label} is not in capitalize format",
      "any.required": "first name is required",
    }),
  middleName: Joi.string().allow(""),
  lastName: Joi.string().required().messages({
    "any.required": "last name is required",
  }),
});

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOccupation: Joi.string().required(),
  motherContactNo: Joi.string().required(),
});

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  contact: Joi.string().required(),
  address: Joi.string().required(),
});

// Define Joi validation schema for the Student object

const studentValidationSchema = Joi.object({
  id: Joi.string().required(),
  name: userNameValidationSchema.required(),
  gender: Joi.string().valid("male", "female", "other").required().messages({
    "any.only": "{#label} is not valid",
  }),
  dateOfBirth: Joi.date().iso(),
  email: Joi.string().email().required().messages({
    "string.email": "{#label} is not a valid email",
    "any.required": "email is required",
  }),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .messages({
      "any.only": "{#label} is not valid",
    }),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianValidationSchema.required(),
  localGuardian: localGuardianValidationSchema.required(),
  profileImg: Joi.string().uri(),
  isActive: Joi.string().valid("active", "blocked").default("active").messages({
    "any.only": "{#label} is not valid",
  }),
});

export { studentValidationSchema };
