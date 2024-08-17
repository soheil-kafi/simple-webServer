const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3500;
const logEvent = require("./middleware/logEvent");
const { errorHandler } = require("./middleware/errorHandler");
const corsOptions = require("./config/corseOptions");
//end import
//middle wares
//custom
app.use((req, res, next) => {
  logEvent(
    `${req.method}\t${req.headers.origin}\t${req.url}\t`,
    "serverLog.log"
  );
  next();
});
app.use(cors(corsOptions));
//buildIn
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
//routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/api/register"));
app.use("/auth", require("./routes/api/auth"));

app.use("/subdir", require("./routes/subDir"));
app.use("/employees", require("./routes/api/employees"));
app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`server run in port ${PORT}`);
});
//
// const os = require("os");
// console.log(os.cpus()[1]);
// console.log(os.platform());
// console.log(os.hostname());
// console.log(os.networkInterfaces().lo[0].mac);
// console.log(os.totalmem());
// console.log(os.uptime());
// console.log(os.userInfo().username);
