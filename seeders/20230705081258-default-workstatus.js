"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("workstates", [
      {
        workState: "WFO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        workState: "WFH",
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
