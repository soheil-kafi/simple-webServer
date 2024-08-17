const logEvent = require("./logEvent");
const errorHandler = (err, req, re, next) => {
  logEvent(`${err.name} : ${err.message}`, "errLog.log");
  console.error(err.stack);
  resizeBy.status(500).send(err.message);
};
module.exports = { errorHandler };
