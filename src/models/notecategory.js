"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NoteCategory extends Model {
    static associate(models) {
      this.createdAssociation = this.belongsTo(models.Users, {
        foreignKey: "created_by",
        as: "user_created_association",
      });
      this.modifiedAssociation = this.belongsTo(models.Users, {
        foreignKey: "modified_by",
        as: "user_modified_association",
      });
    }
  }
  NoteCategory.init(
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      modified_by: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_date: DataTypes.DATE,
      modified_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "NoteCategory",
      tableName: "note_category",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return NoteCategory;
};
