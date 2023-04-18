const express = require("express");

const {
  addNoteTypes,
  editNoteTypes,
  deleteNoteTypes,
  getNoteTypes,
  getSingleNoteTypes,
} = require("../controller/manageNoteTypesController");
const {
  userAuthenticate,
  validationSchema,
} = require("../middleware/middleware");
const { categorySchema } = require("../validationSchema/validationSchema");

const router = express.Router();

router.post(
  "/add-note-types",
  userAuthenticate,
  validationSchema(categorySchema),
  addNoteTypes
);
router.put(
  "/edit-note-types/:id",
  userAuthenticate,
  validationSchema(categorySchema),
  editNoteTypes
);
router.delete("/delete-note-types/:id", userAuthenticate, deleteNoteTypes);
router.get("/get-note-types", userAuthenticate, getNoteTypes);
router.get("/get-note-types/:id", userAuthenticate, getSingleNoteTypes);

module.exports = router;
