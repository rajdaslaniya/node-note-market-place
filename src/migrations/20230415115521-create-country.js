"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("country", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      created_date: {
        type: Sequelize.DATE,
      },
      modified_by: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      modified_date: {
        type: Sequelize.DATE,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("country");
  },
};
