const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  login,
  signUp,
  emailVerify,
  forgotPassword,
  changePassword,
  getUserDetails,
  updateUserDetails,
} = require("../controller/authController");
const {
  validationSchema,
  userAuthenticate,
} = require("../middleware/middleware");
const {
  signUpSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
} = require("../validationSchema/validationSchema");

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(JPG|jpg|jpeg|png)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  if (file.fieldname != "profile_picture") {
    return cb(new Error("Please upload profile_picture"), false);
  }
  cb(undefined, true);
};

const upload = multer(
  multer({
    fileFilter: imageFilter,
    storage: multer.memoryStorage(), //storage
    limits: {
      fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
  })
);

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
router.get("/user-details", userAuthenticate, getUserDetails);
router.post(
  "/update-user-details",
  userAuthenticate,
  upload.single("profile_picture"),
  validationSchema(updateProfileSchema),
  updateUserDetails
);

module.exports = router;
