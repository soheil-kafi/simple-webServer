const data = {
  employees: require("../data/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};
const getAllEmployees = (req, res) => {
  res.json(data.employees);
};
const createNewEmployees = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  if (!newEmployee.firstName || !newEmployee.lastName) {
    return res
      .status(400)
      .json({ message: "firstName and lastName are required" });
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};
const updateEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `employee ID ${req.body.id} not fund` });
  }
  if (req.body.firstName) employee.firstName = req.body.firstName;
  if (req.body.lastName) employee.lastName = req.body.lastName;
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  const unsortedArray = [...filteredArray, employee];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  res.json(data.employees);
};
const deleteEmployee = (req, res) => {
  res.json({ id: req.body.id });
};
const getEmployee = (req, res) => {
  res.json({ id: req.params.id });
};
module.exports = {
  getAllEmployees,
  updateEmployee,
  createNewEmployees,
  deleteEmployee,
  getEmployee,
};
