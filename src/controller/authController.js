const User = require("../models").Users;
const UserRoles = require("../models").UserRoles;
const sequelize = require("sequelize");

const {
  passwordEncrypt,
  userRoles,
  passwordCompare,
  createToken,
  sendEmailVerification,
  generatePassword,
  sendEmailForgotPassword,
} = require("../utils/common");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmailPresent = await User.findOne({
      where: { email_id: email },
      include: {
        model: UserRoles,
        required: true,
        as: "user_role",
      },
    });
    if (
      checkEmailPresent &&
      checkEmailPresent.is_email_verified &&
      checkEmailPresent.is_active
    ) {
      const isValidPassword = await passwordCompare(
        password,
        checkEmailPresent.password
      );
      if (isValidPassword) {
        let token = createToken(
          checkEmailPresent.id,
          checkEmailPresent.email_id
        );
        return res.status(200).json({
          status: 200,
          auth_token: token,
          message: "Login successfully.",
          data: {
            id: checkEmailPresent.id,
            first_name: checkEmailPresent.first_name,
            last_name: checkEmailPresent.last_name,
            email: checkEmailPresent.email_id,
            role_id: checkEmailPresent.role_id,
            role_name: checkEmailPresent.user_role.name,
          },
        });
      }
    }
    return res
      .status(404)
      .json({ status: 404, message: "Invalid email or password" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const signUp = async (req, res, err) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const passwordEncrypted = await passwordEncrypt(password);
    const checkEmailPresent = await User.findOne({
      where: { email_id: email },
    });
    if (checkEmailPresent) {
      return res
        .status(400)
        .json({ status: 400, message: "User email already used." });
    }
    const newUserData = await User.create({
      role_id: userRoles.member,
      first_name,
      last_name,
      email_id: email,
      password: passwordEncrypted,
      is_email_verified: false,
      created_date: new Date(),
    });
    if (newUserData) {
      sendEmailVerification(newUserData.first_name, newUserData.email_id);
      return res.status(201).json({
        status: 201,
        data: newUserData,
        message:
          "User is created successfully and send mail for email verification.",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Some thing went to wrong, please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const emailVerify = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(422)
        .json({ status: 422, message: "User id is required" });
    }
    const updatedUser = await User.update(
      { is_email_verified: true, modified_date: new Date() },
      { where: { id } }
    );
    if (updatedUser[0] > 0) {
      return res
        .status(200)
        .json({ status: 200, message: "Email is verified successfully." });
    }
    return res.status(404).json({ status: 200, message: "User is not find" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(500)
        .json({ status: 500, message: "Please add required field." });
    }
    const password = generatePassword();
    const hashPassword = await passwordEncrypt(password);
    const updatedUser = await User.update(
      { password: hashPassword, modified_date: new Date() },
      { where: { email_id: email } }
    );
    sendEmailForgotPassword(email, password);
    if (updatedUser[0] > 0) {
      return res.status(200).json({
        status: 200,
        message:
          "Password is updated successfully and new password get via mail",
      });
    }
    return res.status(404).json({ status: 404, message: "Email is not find" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { user_id, email } = req.headers;
    const { old_password, new_password } = req.body;

    const userDetails = await User.findOne({
      where: { id: user_id, email_id: email },
    });
    if (userDetails) {
      const compare = await passwordCompare(old_password, userDetails.password);

      if (compare) {
        const newHashPassword = await passwordEncrypt(new_password);
        await User.update(
          {
            password: newHashPassword,
            modified_date: new Date(),
            modified_by: user_id,
          },
          { where: { id: user_id, email_id: email } }
        );
        return res
          .status(200)
          .json({ status: 200, message: "User password updated successfully" });
      }
    }
    return res
      .status(500)
      .json({ status: 500, message: "User current password is wrong" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

module.exports = { login, signUp, emailVerify, forgotPassword, changePassword };
