"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("user_roles", [
      {
        name: "Super Admin",
        description: "For super admin user",
        is_active: true,
        created_date: new Date(),
      },
      {
        name: "Admin",
        description: "For admin user",
        is_active: true,
        created_date: new Date(),
      },
      {
        name: "Member",
        description: "For member user",
        is_active: true,
        created_date: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("user_roles", null, {});
  },
};
