const User = require("../models").Users;
const UserRoles = require("../models").UserRoles;
const UserProfiles = require("../models").UserProfiles;
const Country = require("../models").Country;
const config = require("../firebase_config/firebaseConfig");
const sequelize = require("sequelize");

const {
  passwordEncrypt,
  userRoles,
  passwordCompare,
  createToken,
  sendEmailVerification,
  generatePassword,
  sendEmailForgotPassword,
  uploadFileToFireBase,
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
      sendEmailVerification(
        newUserData.first_name,
        newUserData.email_id,
        newUserData.id
      );
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
      { is_email_verified: true, modified_by: id, modified_date: new Date() },
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

const getUserDetails = async (req, res) => {
  try {
    const { user_id } = req.headers;
    const userDetails = await UserProfiles.findOne({
      attributes: [
        "user_id",
        "dob",
        "gender",
        "phone_code",
        "phone_number",
        "profile_picture",
        "addressLine1",
        "addressLine2",
        "city",
        "state",
        "zip_code",
        "country_id",
        "university",
        "college",
        [sequelize.literal('"user_details"."first_name"'), "first_name"],
        [sequelize.literal('"user_details"."last_name"'), "last_name"],
        [sequelize.literal('"user_details"."email_id"'), "email_id"],
      ],
      where: { user_id },
      include: { model: User, as: "user_details", attributes: [] },
    });
    const country = await Country.findAll({
      attributes: ["id", "name"],
      where: { is_active: true },
    });

    const phone_code = await Country.findAll({
      attributes: ["id", "country_code"],
      where: { is_active: true },
    });

    if (userDetails) {
      return res.status(200).json({
        status: 200,
        message: "User details",
        data: { country, phone_code, userDetails },
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: {
          country,
          phone_code,
          userDetails: {
            first_name: "",
            last_name: "",
            dob: "",
            email: "",
            gender: "",
            phone_code: -1,
            phone_number: "",
            profile_picture: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            zip_code: "",
            country: -1,
            university: "",
            college: "",
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { user_id } = req.headers;
    const dateTime = Number(new Date());
    const downloadURL = await uploadFileToFireBase(
      `profile_picture/DP_${user_id}_${dateTime}`,
      req.file,
      res
    );
    const {
      first_name,
      last_name,
      dob,
      gender,
      phone_code,
      phone_number,
      addressLine1,
      addressLine2,
      city,
      state,
      country_id,
      zip_code,
      college,
      university,
    } = req.body;
    await User.update(
      {
        first_name,
        last_name,
        modified_by: user_id,
        modified_date: new Date(),
      },
      { where: { id: user_id } }
    );
    const userProfile = await UserProfiles.findOne({ where: { user_id } });
    if (userProfile) {
      await UserProfiles.update(
        {
          dob,
          gender,
          state,
          country_id,
          zip_code,
          college,
          addressLine1,
          addressLine2,
          university,
          phone_code,
          phone_number,
          profile_picture: downloadURL,
          city,
          modified_date: new Date(),
          modified_by: user_id,
        },
        { where: { user_id } }
      );
      const userDetails = await UserProfiles.findOne({
        attributes: [
          "user_id",
          "dob",
          "gender",
          "phone_code",
          "phone_number",
          "profile_picture",
          "addressLine1",
          "addressLine2",
          "city",
          "state",
          "zip_code",
          "country_id",
          "university",
          "college",
          [sequelize.literal('"user_details"."first_name"'), "first_name"],
          [sequelize.literal('"user_details"."last_name"'), "last_name"],
          [sequelize.literal('"user_details"."email_id"'), "email_id"],
        ],
        where: { user_id },
        include: { model: User, as: "user_details", attributes: [] },
      });

      return res.status(200).json({
        status: 200,
        message: "User Details updated",
        data: userDetails,
      });
    } else {
      await UserProfiles.create({
        user_id,
        dob,
        gender,
        phone_code,
        phone_number,
        profile_picture: downloadURL,
        addressLine1,
        addressLine2,
        city,
        state,
        country_id,
        zip_code,
        college,
        university,
        created_date: new Date(),
        created_by: user_id,
      });
      const userDetails = await UserProfiles.findOne({
        attributes: [
          "user_id",
          "dob",
          "gender",
          "phone_code",
          "phone_number",
          "profile_picture",
          "addressLine1",
          "addressLine2",
          "city",
          "state",
          "zip_code",
          "country_id",
          "university",
          "college",
          [sequelize.literal('"user_details"."first_name"'), "first_name"],
          [sequelize.literal('"user_details"."last_name"'), "last_name"],
          [sequelize.literal('"user_details"."email_id"'), "email_id"],
        ],
        where: { user_id },
        include: { model: User, as: "user_details", attributes: [] },
      });
      return res.status(200).json({
        status: 200,
        message: "User created successfully.",
        data: userDetails,
      });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  login,
  signUp,
  emailVerify,
  forgotPassword,
  changePassword,
  getUserDetails,
  updateUserDetails,
};
