"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("departments", [
      {
        departmentName: "HR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        departmentName: "Account",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        departmentName: "IT",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        departmentName: "Maintainence",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        departmentName: "Sales",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        departmentName: "R&D",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("departments", null, {});
  },
};
