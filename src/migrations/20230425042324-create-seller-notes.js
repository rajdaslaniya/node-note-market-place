"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("seller_notes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      seller_id: {
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
      status: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "reference_data",
          },
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
        allowNull: false,
      },
      actioned_by: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
        allowNull: true,
      },
      admin_remark: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      published_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      display_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      note_types: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      number_of_page: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      university_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      course: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      course_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      professor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_paid: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      selling_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      note_preview: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_date: {
        type: Sequelize.DATE,
        allowNull: true,
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
        allowNull: true,
      },
      modified_date: {
        type: Sequelize.DATE,
        allowNull: true,
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
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("seller_notes");
  },
};
