const express = require("express");
const { adminUpdateProfile } = require("../controllers/adminController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const routes = express.Router();

routes.post("/update", isAuthenticated, adminUpdateProfile);

module.exports = routes;
