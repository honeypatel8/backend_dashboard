const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const employeeRoutes = require("./routes/employee");
const departmentRoutes = require("./routes/department");
const workstatusRoutes = require("./routes/workstatus");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/departments", departmentRoutes);
app.use("/employee", employeeRoutes);
app.use("/workstatuses", workstatusRoutes);
app.use("/admin", adminRoutes);

app.listen(8800, () => {
  console.log("Server active at PORT:8800");
});
