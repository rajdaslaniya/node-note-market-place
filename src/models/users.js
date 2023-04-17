"use strict";
const { Model } = require("sequelize");
const UserRoles = require("./userroles");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.myAssociation = this.belongsTo(models.UserRoles, {
        foreignKey: "role_id",
        as: "user_role",
      });
    }
  }
  Users.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: UserRoles,
          key: "id",
        },
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_date: DataTypes.DATE,
      modified_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return Users;
};
