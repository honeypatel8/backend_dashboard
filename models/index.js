"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.employee = require("./employee")(sequelize, DataTypes);
db.address = require("./address")(sequelize, DataTypes);
db.department = require("./department")(sequelize, DataTypes);
db.workstate = require("./workstate")(sequelize, DataTypes);
db.role = require("./role")(sequelize, DataTypes);

db.employee.hasMany(db.address, {
  foreignKey: "empId",
  as: "addresses",
});
db.address.belongsTo(db.employee, {
  foreignKey: "empId",
  as: "employee",
});

db.role.hasMany(db.employee, { foreignKey: "roleId" });
db.employee.belongsTo(db.role, { foreignKey: "roleId" });

db.workstate.hasMany(db.employee, { foreignKey: "wstId" });
db.employee.belongsTo(db.workstate, { foreignKey: "wstId", as: "workstate" });

db.department.hasMany(db.employee, { foreignKey: "deptId" });
db.employee.belongsTo(db.department, {
  foreignKey: "deptId",
  as: "department",
});

db.employee.addScope("getMale", {
  where: {
    gender: "male",
  },
});
db.employee.addScope("getFemale", {
  where: {
    gender: "female",
  },
});

module.exports = db;
