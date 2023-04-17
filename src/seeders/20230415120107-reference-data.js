"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("reference_data", [
      {
        value: "Male",
        data_value: "M",
        ref_category: "Gender",
        created_by: 1,
        is_active: true,
        created_date: new Date(),
      },
      {
        value: "Female",
        data_value: "F",
        ref_category: "Gender",
        created_by: 1,
        is_active: true,
        created_date: new Date(),
      },
      {
        value: "Unknown",
        data_value: "U",
        ref_category: "Gender",
        created_by: 1,
        is_active: false,
        created_date: new Date(),
      },
      {
        value: "Paid",
        data_value: "P",
        ref_category: "Selling Mode",
        created_by: 1,
        is_active: false,
        created_date: new Date(),
      },
      {
        value: "Free",
        data_value: "F",
        ref_category: "Selling Mode",
        created_by: 1,
        is_active: false,
        created_date: new Date(),
      },
      {
        value: "Draft",
        data_value: "Draft",
        ref_category: "Notes Status",
        created_by: 1,
        is_active: false,
        created_date: new Date(),
      },
      {
        value: "Submitted For Review",
        data_value: "Submitted For Review",
        ref_category: "Notes Status",
        created_by: 1,
        is_active: false,
        created_date: new Date(),
      },
      {
        value: "In Review",
        data_value: "In Review",
        ref_category: "Notes Status",
        created_by: 1,
        is_active: false,
        created_date: new Date(),
      },
      {
        value: "Published",
        data_value: "Published",
        ref_category: "Notes Status",
        created_by: 1,
        is_active: false,
        created_date: new Date(),
      },
      {
        value: "Rejected",
        data_value: "Rejected",
        ref_category: "Notes Status",
        created_by: 1,
        is_active: false,
        created_date: new Date(),
      },
      {
        value: "Removed",
        data_value: "Removed",
        ref_category: "Notes Status",
        created_by: 1,
        is_active: false,
        created_date: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("reference_data", null, {});
  },
};
