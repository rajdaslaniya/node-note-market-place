const express = require("express");
const multer = require("multer");
const router = express.Router();
const { getCountryAndNotes, addNote } = require("../controller/noteController");
const { userAuthenticate } = require("../middleware/middleware");

const upload = multer(
  multer({
    storage: multer.memoryStorage(),
  })
);

router.get("/country-notes-category", userAuthenticate, getCountryAndNotes);
router.post(
  "/add-note",
  userAuthenticate,
  upload.fields([
    { name: "display_picture", maxCount: 1 },
    { name: "upload_note", maxCount: 1 },
    { name: "note_preview", maxCount: 1 },
  ]),
  addNote
);
module.exports = router;
