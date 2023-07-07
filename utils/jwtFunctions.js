const jwt = require("jsonwebtoken");

exports.generateToken = async (data) => {
  return await jwt.sign(data, "secret");
};

exports.validateToken = async (token) => {
  return await jwt.compare(token, "secret");
};
