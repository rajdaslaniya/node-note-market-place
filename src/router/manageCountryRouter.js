const express = require("express");

const {
  addCountry,
  editCountry,
  deleteCountry,
  getCountry,
  getSingleCountry,
} = require("../controller/manageCountryController");
const {
  userAuthenticate,
  validationSchema,
} = require("../middleware/middleware");
const { countrySchema } = require("../validationSchema/validationSchema");

const router = express.Router();

router.post(
  "/add-country",
  userAuthenticate,
  validationSchema(countrySchema),
  addCountry
);
router.put(
  "/edit-country/:id",
  userAuthenticate,
  validationSchema(countrySchema),
  editCountry
);
router.delete("/delete-country/:id", userAuthenticate, deleteCountry);
router.get("/get-country", userAuthenticate, getCountry);
router.get("/get-country/:id", userAuthenticate, getSingleCountry);

module.exports = router;
