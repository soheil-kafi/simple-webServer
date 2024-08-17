const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { format } = require("date-fns");
const { v7: uuid } = require("uuid");

const logEvent = async (message, logFile) => {
  const date = `${format(new Date(), "yyyy:MM:dd\tHH:mm:ss")}`;
  const logItem = `${date}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFile),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};
// const logger = (req, res, next) => {
//   logEvent(
//     `${req.method}\t${req.headers.origin}\t${req.url}\t`,
//     "serverLog.txt"
//   );
//   next();
// };

module.exports = logEvent;
