const Op = require("sequelize").Op;
const sequelize = require("sequelize");

const { userRoles } = require("../utils/common");
const NoteTypes = require("../models").NoteType;
const Users = require("../models").Users;

const addNoteTypes = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { user_id, role_id } = req.headers;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const noteTypes = await NoteTypes.create({
      name,
      description,
      created_by: user_id,
      created_date: new Date(),
    });

    return res.status(201).json({
      status: 201,
      data: noteTypes,
      message: "NoteTypes added successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const editNoteTypes = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { user_id, role_id } = req.headers;
    const { id } = req.params;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const noteTypes = await NoteTypes.update(
      {
        name,
        description,
        modified_by: user_id,
        modified_date: new Date(),
        is_active: true,
      },
      { where: { id } }
    );
    if (noteTypes[0] > 0) {
      const countryDetails = await NoteTypes.findOne({ where: { id } });
      return res.status(200).json({
        status: 200,
        message: "NoteTypes updated successfully",
        data: countryDetails,
      });
    }
    return res
      .status(404)
      .json({ status: 404, message: "NoteTypes not found" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const deleteNoteTypes = async (req, res) => {
  try {
    const { user_id, role_id } = req.headers;
    const { id } = req.params;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const noteTypes = await NoteTypes.update(
      {
        is_active: false,
        modified_by: user_id,
        modified_date: new Date(),
      },
      { where: { id } }
    );
    if (noteTypes[0] > 0) {
      return res.status(200).json({
        status: 200,
        message: "NoteTypes deleted successfully",
      });
    }
    return res
      .status(404)
      .json({ status: 404, message: "NoteTypes not found" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const getNoteTypes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      col_name = "created_date",
      order = "desc",
    } = req.query;
    const { role_id } = req.headers;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const noteTypes = await NoteTypes.findAll({
      attributes: [
        "name",
        "description",
        "created_date",
        [
          sequelize.literal('"user_created_association"."first_name"'),
          "added_by",
        ],
        "is_active",
      ],
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          {
            description: { [Op.iLike]: `%${search}%` },
          },
          {
            "$user_created_association.first_name$": {
              [Op.iLike]: `%${search}%`,
            },
          },
          sequelize.where(
            sequelize.cast(sequelize.col("NoteType.created_date"), "varchar"),
            { [Op.iLike]: `%${search}%` }
          ),
        ],
      },
      include: {
        model: Users,
        required: true,
        as: "user_created_association",
        attributes: [],
      },
      order: [[col_name, order]],
      limit: limit,
      offset: (page - 1) * limit,
    });

    const count = await NoteTypes.count({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          {
            description: { [Op.iLike]: `%${search}%` },
          },
          {
            "$user_created_association.first_name$": {
              [Op.iLike]: `%${search}%`,
            },
          },
          sequelize.where(
            sequelize.cast(sequelize.col("NoteType.created_date"), "varchar"),
            { [Op.iLike]: `%${search}%` }
          ),
        ],
      },
      include: {
        model: Users,
        required: true,
        as: "user_created_association",
        attributes: [],
      },
    });

    return res.status(200).json({
      status: 200,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        page: Number(page),
        limit: Number(limit),
      },
      message: "NoteTypes details",
      data: noteTypes,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const getSingleNoteTypes = async (req, res) => {
  try {
    const { role_id } = req.headers;
    const { id } = req.params;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const noteTypes = await NoteTypes.findOne({ where: { id } });
    if (noteTypes) {
      return res.status(200).json({
        status: 200,
        message: "NoteTypes deleted successfully",
        data: noteTypes,
      });
    }
    return res
      .status(404)
      .json({ status: 404, message: "NoteTypes not found" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

module.exports = {
  addNoteTypes,
  editNoteTypes,
  deleteNoteTypes,
  getNoteTypes,
  getSingleNoteTypes,
};
