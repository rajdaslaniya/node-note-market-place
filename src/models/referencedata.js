"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReferenceData extends Model {
    static associate(models) {}
  }
  ReferenceData.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data_value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ref_category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
      created_date: DataTypes.DATE,
      modified_date: DataTypes.DATE,
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "ReferenceData",
      tableName: "reference_data",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return ReferenceData;
};
