const jwt = require("jsonwebtoken");
const db = require("../models/index");

const Employee = db.employee;

const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Login required." });
    }

    const tokenDecoded = await jwt.verify(token, "secret");

    const { id, roleId } = await Employee.findByPk(tokenDecoded.id);

    roleId === 1 && (req.body.id = id);
    roleId === 1 && (req.body.roleId = "1");
    // req.user = employee;

    next();
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = isAuthenticated;
