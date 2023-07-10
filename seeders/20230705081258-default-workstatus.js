"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("workstates", [
      {
        workState: "Work From Office",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        workState: "Work From Home",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        workState: "FULL LEAVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        workState: "HALF LEAVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("workstates", null, {});
  },
};
