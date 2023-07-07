const bcrypt = require("bcrypt");

exports.validatePassword = async (password, originalPassword) => {
  return await bcrypt.compare(password, originalPassword);
};
