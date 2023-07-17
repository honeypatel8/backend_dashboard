const express = require("express");
const {
  fetchGenderRatio,
  registerEmployee,
  loginEmployee,
  logoutEmployee,
  updateProfile,
  fetchBirthDay,
  fetchAllEmployees,
  deleteEmployee,
  fetchFullLeaves,
} = require("../controllers/employeeController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const routes = express.Router();

routes.get("/stats", fetchGenderRatio);
routes.post("/update", isAuthenticated, updateProfile);
routes.post("/register", registerEmployee);
routes.post("/login", loginEmployee);
routes.post("/logout", logoutEmployee);
routes.get("/birthday", fetchBirthDay);
routes.get("/fullleave", fetchFullLeaves);
routes.get("/", fetchAllEmployees);
routes.post("/delete", deleteEmployee);

module.exports = routes;
