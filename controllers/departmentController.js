const employee = require("../models/employee");
const db = require("../models/index");

const Department = db.department;
const Employee = db.employee;
const Role = db.role;

const fetchDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: {
        model: Employee,
        attributes: ["id", "firstName"],
      },
      // attributes: ["departmentName"],
    });
    // const departments = await Role.findAll({
    //   include: [Employee],
    // });

    res.status(200).json({ data: departments });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const fetchDepartmentWorkforceRatio = async (req, res) => {
  try {
    const departments = await Department.findAll({
      attributes: [
        "id",
        ["departmentName", "label"],
        [db.Sequelize.fn("COUNT", db.Sequelize.col("Employees.id")), "value"],
      ],
      include: [{ model: Employee, attributes: [] }],
      group: ["Department.id"],
    });

    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  fetchDepartments,
  fetchDepartmentWorkforceRatio,
};
