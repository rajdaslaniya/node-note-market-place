const User = require("../models").Users;
const { verifyToken } = require("../utils/common");

const userAuthenticate = async (req, res, next) => {
  try {
    const { auth_token } = req.headers;
    if (!auth_token) {
      return res
        .status(400)
        .json({ status: 400, message: "Please passed token" });
    }
    const userDetail = verifyToken(auth_token);
    const user = await User.findOne({
      where: {
        id: userDetail.user_id,
        email_id: userDetail.email,
        is_active: true,
      },
    });
    if (user) {
      req.headers.user_id = user.id;
      req.headers.email = user.email_id;
      return next();
    }
  } catch (error) {
    return res.status(409).json({
      status: 409,
      message: "Unauthorized user for perform this task",
    });
  }
};

const validationSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const { details } = error;
    const message = details.map((i) => i.message).join(",");
    return res.status(422).json({ status: 422, message });
  } else {
    next();
  }
};

module.exports = {
  validationSchema,
  userAuthenticate,
};
