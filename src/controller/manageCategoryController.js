const Op = require("sequelize").Op;
const sequelize = require("sequelize");

const { userRoles } = require("../utils/common");
const Category = require("../models").NoteCategory;
const Users = require("../models").Users;

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { user_id, role_id } = req.headers;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const category = await Category.create({
      name,
      description,
      created_by: user_id,
      created_date: new Date(),
    });

    return res.status(201).json({
      status: 201,
      data: category,
      message: "Category added successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const editCategory = async (req, res) => {
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
    const category = await Category.update(
      {
        name,
        description,
        modified_by: user_id,
        modified_date: new Date(),
        is_active: true,
      },
      { where: { id } }
    );
    if (category[0] > 0) {
      const categoryDetails = await Category.findOne({ where: { id } });
      return res.status(200).json({
        status: 200,
        message: "Category updated successfully",
        data: categoryDetails,
      });
    }
    return res.status(404).json({ status: 404, message: "Category not found" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { user_id, role_id } = req.headers;
    const { id } = req.params;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const country = await Category.update(
      {
        is_active: false,
        modified_by: user_id,
        modified_date: new Date(),
      },
      { where: { id } }
    );
    if (country[0] > 0) {
      return res.status(200).json({
        status: 200,
        message: "Category deleted successfully",
      });
    }
    return res.status(404).json({ status: 404, message: "Category not found" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const getCategory = async (req, res) => {
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
    const category = await Category.findAll({
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
            sequelize.cast(
              sequelize.col("NoteCategory.created_date"),
              "varchar"
            ),
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

    const count = await Category.count({
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
            sequelize.cast(
              sequelize.col("NoteCategory.created_date"),
              "varchar"
            ),
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
      message: "Category details",
      data: category,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const getSingleCategory = async (req, res) => {
  try {
    const { role_id } = req.headers;
    const { id } = req.params;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const category = await Category.findOne({ where: { id } });
    if (category) {
      return res.status(200).json({
        status: 200,
        message: "Category deleted successfully",
        data: category,
      });
    }
    return res.status(404).json({ status: 404, message: "Category not found" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

module.exports = {
  addCategory,
  editCategory,
  deleteCategory,
  getCategory,
  getSingleCategory,
};
