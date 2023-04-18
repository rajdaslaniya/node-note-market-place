const Op = require("sequelize").Op;
const sequelize = require("sequelize");

const { userRoles } = require("../utils/common");
const Country = require("../models").Country;
const Users = require("../models").Users;

const addCountry = async (req, res) => {
  try {
    const { name, code } = req.body;
    const { user_id, role_id } = req.headers;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const country = await Country.create({
      name,
      country_code: code,
      created_by: user_id,
      created_date: new Date(),
    });

    return res.status(201).json({
      status: 201,
      data: country,
      message: "Country added successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const editCountry = async (req, res) => {
  try {
    const { name, code } = req.body;
    const { user_id, role_id } = req.headers;
    const { id } = req.params;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const country = await Country.update(
      {
        name,
        country_code: code,
        modified_by: user_id,
        modified_date: new Date(),
        is_active: true,
      },
      { where: { id } }
    );
    if (country[0] > 0) {
      const countryDetails = await Country.findOne({ where: { id } });
      return res.status(200).json({
        status: 200,
        message: "Country updated successfully",
        data: countryDetails,
      });
    }
    return res.status(404).json({ status: 404, message: "Country not found" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const deleteCountry = async (req, res) => {
  try {
    const { user_id, role_id } = req.headers;
    const { id } = req.params;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const country = await Country.update(
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
        message: "Country deleted successfully",
      });
    }
    return res.status(404).json({ status: 404, message: "Country not found" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const getCountry = async (req, res) => {
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
    const country = await Country.findAll({
      attributes: [
        "name",
        "country_code",
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
            country_code: { [Op.iLike]: `%${search}%` },
          },
          {
            "$user_created_association.first_name$": {
              [Op.iLike]: `%${search}%`,
            },
          },
          sequelize.where(
            sequelize.cast(sequelize.col("Country.created_date"), "varchar"),
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

    const count = await Country.count({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          {
            country_code: { [Op.iLike]: `%${search}%` },
          },
          {
            "$user_created_association.first_name$": {
              [Op.iLike]: `%${search}%`,
            },
          },
          sequelize.where(
            sequelize.cast(sequelize.col("Country.created_date"), "varchar"),
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
      message: "Country details",
      data: country,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const getSingleCountry = async (req, res) => {
  try {
    const { role_id } = req.headers;
    const { id } = req.params;
    if (role_id === userRoles.member) {
      return res.status(409).json({
        status: 409,
        message: "Unauthorized user to perform this task",
      });
    }
    const country = await Country.findOne({ where: { id } });
    if (country) {
      return res.status(200).json({
        status: 200,
        message: "Country deleted successfully",
        data: country,
      });
    }
    return res.status(404).json({ status: 404, message: "Country not found" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

module.exports = {
  addCountry,
  editCountry,
  deleteCountry,
  getCountry,
  getSingleCountry,
};
