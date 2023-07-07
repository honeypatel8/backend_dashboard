const express = require("express");
const departmentControllers = require("../controllers/departmentController");

const routes = express.Router();

routes.get("/", departmentControllers.fetchDepartments);
routes.get("/stats", departmentControllers.fetchDepartmentWorkforceRatio);

module.exports = routes;
