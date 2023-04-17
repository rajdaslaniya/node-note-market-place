"use strict";
const { Model } = require("sequelize");
const Users = require("./users");
const Country = require("./country");
const ReferenceData = require("./referencedata");

module.exports = (sequelize, DataTypes) => {
  class UserProfiles extends Model {
    static associate(models) {
      this.userAssociation = this.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "user_details",
      });
      this.genderAssociation = this.belongsTo(models.ReferenceData, {
        foreignKey: "gender",
        as: "gender_details",
      });
      this.phoneCodeAssociation = this.belongsTo(models.Country, {
        foreignKey: "phone_code",
        as: "country_details_code",
      });
      this.countryAssociation = this.belongsTo(models.Country, {
        foreignKey: "country_id",
        as: "country_details",
      });
    }
  }
  UserProfiles.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Users,
          key: "id",
        },
        allowNull: false,
      },
      dob: DataTypes.DATE,
      gender: {
        type: DataTypes.INTEGER,
        references: {
          model: ReferenceData,
          key: "id",
        },
        allowNull: false,
      },
      secondary_email: DataTypes.STRING,
      phone_code: {
        type: DataTypes.INTEGER,
        references: {
          model: Country,
          key: "id",
        },
        allowNull: false,
      },
      phone_number: { type: DataTypes.STRING, allowNull: false },
      profile_picture: DataTypes.STRING,
      addressLine1: { type: DataTypes.STRING, allowNull: false },
      addressLine2: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      state: { type: DataTypes.STRING, allowNull: false },
      zip_code: { type: DataTypes.STRING, allowNull: false },
      country_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Country,
          key: "id",
        },
        allowNull: false,
      },
      university: DataTypes.STRING,
      college: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
      modified_date: DataTypes.DATE,
      created_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserProfiles",
      tableName: "user_profile",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return UserProfiles;
};
