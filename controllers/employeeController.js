const employee = require("../models/employee");
const db = require("../models/index");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const { generateToken, validateToken } = require("../utils/jwtFunctions");
const { validatePassword } = require("../utils/bcryptFunctions");

const Department = db.department;
const Employee = db.employee;
const Workstate = db.workstate;
const Address = db.address;
const Role = db.role;

const fetchGenderRatio = async (req, res) => {
  try {
    const { count: male, rows: maleRows } = await Employee.scope(
      "getMale"
    ).findAndCountAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("gender")), "count"],
      ],
    });
    const { count: female, rows: femaleRows } = await Employee.scope(
      "getFemale"
    ).findAndCountAll({
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("gender")), "count"],
      ],
    });

    console.log(maleRows);

    res.status(200).json([
      { id: 1, label: "male", value: male },
      { id: 2, label: "female", value: female },
    ]);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const registerEmployee = async (req, res) => {
  try {
    const validate1 = await Employee.findOne({
      where: { email: req.body.email },
    });

    if (validate1) {
      return res.status(400).json({ message: "Email ID already used." });
    }

    const data = await Employee.create(req.body);

    const token = await generateToken({ id: data.id, role: data.roleId });

    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    res.status(200).json({ message: "Employee created.", token: token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { email } = req.body;

    const employee = await Employee.findOne({
      where: { email },

      include: [
        { model: Department, as: "department" },
        { model: Workstate, as: "workstate" },
        { model: Address, as: "addresses" },
        { model: Role },
      ],
      where: { email: email },

      include: [
        { model: Department, as: "department" },
        { model: Workstate, as: "workstate" },
        { model: Address, as: "addresses" },
      ],
    });

    if (!employee) {
      res.status(400).json({ message: "User does not exists." });
      return;
    }

    const isMatch = await validatePassword(
      req.body.password,
      employee.password
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = await generateToken({
      id: employee.id,
    });

    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    employee.role = `${employee.roleId === 2 ? "Admin" : "Employee"}`;
    console.log(employee);
    const { password, ...employeeData } = employee.toJSON();
    // employee.role = `${employee.roleId === 2 ? 'admin' : 'employee'}`
    // console.log(employee.role);

    res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "Signed In.", user: employeeData });
    // .json({ message: "Signed In.", user: { firstName: `${employee.firstName}`, lastName: `${employee.lastName}`, role: `${employee.roleId === 2 ? 'admin' : 'employee'}`, email: `${employee.email}`, gender: `${employee.gender}`, dob: `${employee.dob}`, doj: `${employee.doj}`, phone: `${employee.phone}`, department: `${employee.deptId}`, workStatus: `${employee.wstId}` }, });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const logoutEmployee = async (req, res) => {
  try {
    res.status(200).clearCookie("token").json({ message: "Logged out." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { current, permanent, id, ...employeePayload } = req.body;
    console.log(id);

    const updatedEmployee = await Employee.update(
      {
        ...employeePayload,
      },
      { where: { id: id } }
      // {
      //   include: [{ model: Department, as: "department" }, { model: Workstate, as: "workstate" }, { model: Address, as: "addresses" }]
      // }
    );

    const addressExists = await Address.findAll({
      where: { empID: id },
    });

    if (addressExists.length === 0) {
      //create new address.

      current &&
        (await Address.create({
          empId: id,
          ...current,
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
        }));
      permanent &&
        (await Address.create({
          empId: id,
          ...permanent,
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
        }));
    } else {
      // update appropriate address, current ,permanent or both.
      current &&
        (await Address.update(
          { ...current },
          { where: { empId: id, type: "current" } }
        ));
      permanent &&
        (await Address.update(
          { ...permanent },
          { where: { empId: id, type: "permanent" } }
        ));
    }

    if (!!updatedEmployee) {
      var user = await Employee.findOne({
        where: { id: id },
        attributes: { exclude: ["password"] },
        include: [
          { model: Department, as: "department" },
          { model: Workstate, as: "workstate" },
          { model: Address, as: "addresses" },
          { model: Role },
        ],
      });
    }

    // const data = await Address.create(
    //   {
    //     street,
    //     city,
    //     state,
    //     pincode,
    //     type,
    //     employee: {
    //       firstName,
    //       lastName,
    //       email,
    //       password,
    //       gender,
    //       dob: new Date().toString(),
    //       doj: new Date().toString(),
    //       phone,
    //       deptId,
    //       wstId,
    //     },
    //   },
    //   {
    //     include: [db.empAddBind],
    //   }
    // );

    res.status(200).json({ message: "Profile updated.", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchBirthDay = async (req, res) => {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1; // Adding 1 to get 1-based month
    const todayDate = today.getDate();

    const employees = await Employee.findAll({
      where: db.sequelize.where(
        db.Sequelize.fn("MONTH", db.Sequelize.col("dob")),
        todayMonth
      ),
      where: db.sequelize.where(
        db.sequelize.fn("DAY", db.sequelize.col("dob")),
        todayDate
      ),
    });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const fetchFullLeaves = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { wstId: "3" },
    });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        { model: Department, as: "department" },
        { model: Workstate, as: "workstate" },
        { model: Role },
      ],
    });

    res.status(200).json({ message: "Fetched All Employees", user: employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.body;

  try {
    const response = await Employee.destroy({
      where: { id: id },
    });

    res.status(200).json({ message: "Employee Deleted." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  fetchGenderRatio,
  updateProfile,
  registerEmployee,
  loginEmployee,
  logoutEmployee,
  fetchBirthDay,
  fetchAllEmployees,
  deleteEmployee,
  fetchFullLeaves,
};
