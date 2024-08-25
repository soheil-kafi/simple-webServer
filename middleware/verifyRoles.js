const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401);
    }
    const roleArray = [...allowedRoles];

    const result = req.roles
      .map((role) => roleArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401);
    next();
  };
};
module.exports = verifyRoles;
/*
route x only for admin
verify role(user , editor , admin)
hi am naser role = {user}
false
*/
