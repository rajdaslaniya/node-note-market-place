const Joi = require("joi");

const signUpSchema = Joi.object({
  email: Joi.string().email().required("Email id is required"),
  password: Joi.string().required("Password is required"),
  first_name: Joi.string().required("First name is required"),
  last_name: Joi.string().required("Last name is required"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required("Email id is required"),
  password: Joi.string().required("Password is required"),
});

const changePasswordSchema = Joi.object({
  old_password: Joi.string().required("Old password is required"),
  new_password: Joi.string().required("New password is required"),
});

const countrySchema = Joi.object({
  name: Joi.string().required("Name is required"),
  code: Joi.string().required("Code is required"),
});

const categorySchema = Joi.object({
  name: Joi.string().required("Name is required"),
  description: Joi.string().required("Description is required"),
});

const updateProfileSchema = Joi.object({
  first_name: Joi.string().required("First name is required"),
  last_name: Joi.string().required("Last name is required"),
  dob: Joi.date().required("Dob is required"),
  gender: Joi.string().required("Gender is required"),
  phone_code: Joi.string().required("Phone code is required"),
  phone_number: Joi.string().required("Phone number is required"),
  addressLine1: Joi.string().required("Address line1 is required"),
  addressLine2: Joi.string().required("Address line1 is required"),
  city: Joi.string().required("City is required"),
  state: Joi.string().required("State is required"),
  country_id: Joi.string().required("Country id is required"),
  zip_code: Joi.string().required("Zip code is required"),
  college: Joi.string().required("College name is required"),
  university: Joi.string().required("University name is required"),
});

module.exports = {
  signUpSchema,
  loginSchema,
  changePasswordSchema,
  countrySchema,
  categorySchema,
  updateProfileSchema,
};
