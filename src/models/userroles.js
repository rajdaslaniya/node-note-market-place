"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    static associate(models) {}
  }
  UserRoles.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      created_date: DataTypes.DATE,
      modified_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserRoles",
      tableName: "user_roles",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return UserRoles;
};
