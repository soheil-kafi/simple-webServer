const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employeesControler");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
//End

router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeeController.createNewEmployees
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeeController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee);
router.route("/:id").get(employeeController.getEmployee);
module.exports = router;
