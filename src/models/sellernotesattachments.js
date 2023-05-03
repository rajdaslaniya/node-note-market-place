"use strict";
const { Model } = require("sequelize");
const SellerNotes = require("./sellernotes");
module.exports = (sequelize, DataTypes) => {
  class SellerNotesAttachments extends Model {
    static associate(models) {
      this.sellerNoteAssociation = this.belongsTo(models.SellerNotes, {
        foreignKey: "note_id",
        as: "note_details",
      });
    }
  }
  SellerNotesAttachments.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      note_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: SellerNotes,
          key: "id",
        },
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      modified_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      modified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "SellerNotesAttachments",
      tableName: "seller_notes_attachment",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return SellerNotesAttachments;
};
