const db = require("../models/index");
const Workstatuses = db.workstate;
const Employee = db.employee;
const Address = db.address;

const adminUpdateProfile = async (req, res) => {
  try {
    const { current, permanent, id, ...employeePayload } = req.body;

    console.log(id);
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

    res.status(200).json({ message: "Profile updated." });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports = {
  adminUpdateProfile,
};
