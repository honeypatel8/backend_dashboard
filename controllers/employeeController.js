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
    // const count = +male + +female;

    // const males = (male / count) * 100;
    // const females = (female / count) * 100;

    res.status(200).json([
      { id: 1, label: "male", value: male },
      { id: 1, label: "female", value: female },
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
      res.status(401).json({ message: "User already exists." });
      return;
    }

    const data = await Employee.create(req.body);

    const token = await generateToken({ id: data.id, role: data.roleId });

    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "Employee created.", token: token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({
      where: { email: email },
    });

    if (!employee) {
      res.status(400).json({ message: "User does not exists." });
      return;
    }

    const isMatch = await validatePassword(password, employee.password);

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
    res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "Signed In." });
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

    await Employee.update(
      {
        ...employeePayload,
      },
      { where: { id: id } }
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

    res.status(200).json({ message: "Profile updated." });
  } catch (error) {
    res.status(500).json({ message: error });
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

module.exports = {
  fetchGenderRatio,
  updateProfile,
  registerEmployee,
  loginEmployee,
  logoutEmployee,
  fetchBirthDay,
};
