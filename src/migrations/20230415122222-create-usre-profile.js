"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_profile", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
        allowNull: false,
      },
      dob: {
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "reference_data",
          },
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      secondary_email: {
        type: Sequelize.STRING,
      },
      phone_code: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "country",
          },
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profile_picture: {
        type: Sequelize.STRING,
      },
      addressLine1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      addressLine2: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      zip_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "country",
          },
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
        allowNull: false,
      },
      university: {
        type: Sequelize.STRING,
      },
      college: {
        type: Sequelize.STRING,
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      created_date: {
        type: Sequelize.DATE,
      },
      modified_by: {
        type: Sequelize.INTEGER,
      },
      modified_date: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_profile");
  },
};
