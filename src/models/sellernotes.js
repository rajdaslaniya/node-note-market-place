"use strict";
const { Model } = require("sequelize");
const Users = require("./users");
const ReferenceData = require("./referencedata");

module.exports = (sequelize, DataTypes) => {
  class SellerNotes extends Model {
    static associate(models) {
      this.sellerAssociation = this.belongsTo(models.Users, {
        foreignKey: "seller_id",
        as: "seller_details",
      });
      this.statusAssociation = this.belongsTo(models.ReferenceData, {
        foreignKey: "status",
        as: "status_details",
      });
      this.createdByAssociation = this.belongsTo(models.Users, {
        foreignKey: "created_by",
        as: "created_by_details",
      });
      this.modifiedByAssociation = this.belongsTo(models.Users, {
        foreignKey: "modified_by",
        as: "modified_by_details",
      });
    }
  }
  SellerNotes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      seller_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Users,
          key: "id",
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        references: {
          model: ReferenceData,
          key: "id",
        },
        allowNull: false,
      },
      actioned_by: {
        type: DataTypes.INTEGER,
        references: {
          model: Users,
          key: "id",
        },
        allowNull: true,
      },
      admin_remark: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      published_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      display_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      note_types: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      number_of_page: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      university_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      course: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      course_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      professor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      selling_price: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      note_preview: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: Users,
          key: "id",
        },
        allowNull: true,
      },
      modified_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      modified_by: {
        type: DataTypes.INTEGER,
        references: {
          model: Users,
          key: "id",
        },
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "SellerNotes",
      tableName: "seller_notes",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return SellerNotes;
};
