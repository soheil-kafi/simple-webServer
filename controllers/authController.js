const userDB = {
  users: require("../data/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};
const logEvent = require("../middleware/logEvent");
const bcrypt = require("bcrypt");
const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "userName and password are required" });
  }
  const foundUser = userDB.users.find((person) => person.userName === user);

  if (!foundUser) {
    return res.sendStatus(401); //Unauthorized
  }
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    res.json({ success: `user ${user} is logged in` });
    logEvent(`${user} logged in with auth`, "usersLog.log");
  } else {
    logEvent(`${user} cant logged in with auth`, "errLog.log");
    res.sendStatus(401);
  }
};
module.exports = { handleLogin };
