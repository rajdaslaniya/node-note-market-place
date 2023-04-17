const express = require("express");
const router = express.Router();
const {
  login,
  signUp,
  emailVerify,
  forgotPassword,
  changePassword,
} = require("../controller/authController");
const {
  validationSchema,
  userAuthenticate,
} = require("../middleware/middleware");
const {
  signUpSchema,
  loginSchema,
  changePasswordSchema,
} = require("../validationSchema/validationSchema");

router.post("/login", validationSchema(loginSchema), login);
router.post("/sign-up", validationSchema(signUpSchema), signUp);
router.get("/email-verified/:id", emailVerify);
router.put("/forgot-password", forgotPassword);
router.put(
  "/change-password",
  userAuthenticate,
  validationSchema(changePasswordSchema),
  changePassword
);

module.exports = router;
