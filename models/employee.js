"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) { }
  }
  Employee.init(
    {
      firstName: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: { notEmpty: true },
      },
      lastName: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: { notEmpty: true },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        // validate: { isEmail: true, notEmpty: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hash);
        },
        // validate: { notEmpty: true },
      },
      gender: DataTypes.STRING,
      dob: DataTypes.DATE,
      doj: DataTypes.DATE,
      phone: DataTypes.INTEGER,
      deptId: { type: DataTypes.INTEGER, references: { model: "departments" } },
      wstId: { type: DataTypes.INTEGER, references: { model: "workstates" } },
      roleId: { type: DataTypes.INTEGER, references: { model: "roles" }, defaultValue: 1 },
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );
  return Employee;
};
