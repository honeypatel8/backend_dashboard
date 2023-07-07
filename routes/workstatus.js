const express = require("express");
const {
  fetchWorkStatuses,
  fetchWorkStatusStats,
} = require("../controllers/workstatusController");

const routes = express.Router();

routes.get("/", fetchWorkStatuses);
routes.get("/stats", fetchWorkStatusStats);

module.exports = routes;
