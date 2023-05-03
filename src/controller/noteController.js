const { uploadFileToFireBase } = require("../utils/common");

const Country = require("../models").Country;
const NoteType = require("../models").NoteType;
const NoteCategory = require("../models").NoteCategory;

const getCountryAndNotes = async (req, res) => {
  try {
    const country = await Country.findAll({
      attributes: ["id", "name"],
      where: { is_active: true },
    });
    const notes = await NoteType.findAll({
      attributes: ["id", "name"],
      where: { is_active: true },
    });
    const category = await NoteCategory.findAll({
      attributes: ["id", "name"],
      where: { is_active: true },
    });
    return res.status(200).json({
      status: 200,
      data: { country, category, notes },
      message: "Data get successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const addNote = async (req, res) => {
  try {
    const { user_id } = req.headers;
    const { note_preview, upload_note, display_picture } = req.files;
    const dateTime = Number(new Date().getTime());
    let display_picture_url, note_preview_url, upload_note_url;
    if (display_picture) {
      display_picture_url = await uploadFileToFireBase(
        `display_picture/DP_${user_id}_${dateTime}`,
        display_picture[0],
        res
      );
    }

    if (note_preview) {
      note_preview_url = await uploadFileToFireBase(
        `note_preview/Note_${user_id}_${dateTime}`,
        note_preview[0],
        res
      );
    }

    if (upload_note) {
      upload_note_url = await uploadFileToFireBase(
        `upload_note/Note_${user_id}_${dateTime}`,
        upload_note[0],
        res
      );
    }

    // const {
    //   title,
    //   category,
    //   note_types,
    //   number_of_page,
    //   description,
    //   country_id,
    //   university_name,
    //   course,
    //   course_code,
    //   professor,
    //   is_paid,
    //   selling_price,
    //   status,
    // } = req.body;
    // console.log(
    //   title,
    //   category,
    //   note_types,
    //   number_of_page,
    //   description,
    //   country_id,
    //   university_name,
    //   course,
    //   course_code,
    //   professor,
    //   is_paid,
    //   selling_price,
    //   status
    // );

    return res.status(200).json({ status: 200 });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

module.exports = { getCountryAndNotes, addNote };
