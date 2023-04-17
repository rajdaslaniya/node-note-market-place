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

module.exports = { signUpSchema, loginSchema, changePasswordSchema };
