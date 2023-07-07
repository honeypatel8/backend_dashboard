const db = require("../models/index");
const workstate = require("../models/workstate");
const Workstatuses = db.workstate;
const Employee = db.employee;

const fetchWorkStatuses = async (req, res) => {
  try {
    const data = await Workstatuses.findAll({
      include: {
        model: Employee,
      },
    });

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const fetchWorkStatusStats = async (req, res) => {
  try {
    const workstatuses = await Workstatuses.findAll({
      attributes: [
        "id",
        ["workState", "label"],
        [db.Sequelize.fn("COUNT", db.Sequelize.col("Employees.id")), "value"],
      ],
      include: [{ model: Employee, attributes: [] }],
      group: ["WorkState.id"],
    });

    // const totalEmployees = workstatuses.reduce((acc, workstate) => {
    //   return (acc += workstate.dataValues.employeeCount);
    // }, 0);

    // const modifiesStatuses = workstatuses.map((workstate) => {
    //   return (workstate.dataValues.value =
    //     (workstate.dataValues.employeeCount / totalEmployees) * 100);
    // });

    // console.log(modifiesStatuses);
    res.status(200).json(workstatuses);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  fetchWorkStatuses,
  fetchWorkStatusStats,
};
