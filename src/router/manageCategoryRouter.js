const express = require("express");

const {
  addCategory,
  editCategory,
  deleteCategory,
  getCategory,
  getSingleCategory,
} = require("../controller/manageCategoryController");
const {
  userAuthenticate,
  validationSchema,
} = require("../middleware/middleware");
const { categorySchema } = require("../validationSchema/validationSchema");

const router = express.Router();

router.post(
  "/add-category",
  userAuthenticate,
  validationSchema(categorySchema),
  addCategory
);
router.put(
  "/edit-category/:id",
  userAuthenticate,
  validationSchema(categorySchema),
  editCategory
);
router.delete("/delete-category/:id", userAuthenticate, deleteCategory);
router.get("/get-category", userAuthenticate, getCategory);
router.get("/get-category/:id", userAuthenticate, getSingleCategory);

module.exports = router;
