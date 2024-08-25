const userDB = {
  users: require("../data/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const logEvent = require("../middleware/logEvent.js");
//
const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.status(400).json({ message: "user name and password are required." });
  }
  const duplicate = userDB.users.find((person) => person.userName === user);
  if (duplicate) {
    return res.sendStatus(409); //Conflict
  }
  try {
    //hash the psw
    const hashedPwd = await bcrypt.hash(pwd, 9);
    //stor
    const newUser = {
      userName: user,
      password: hashedPwd,
      roles: { User: 1400 },
    };
    userDB.setUser([...userDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(userDB.users)
    );
    logEvent(`user with name : ${user} has created`, "usersLog.log");
    res.status(201).json({ message: `user ${user} created` });
  } catch (error) {
    res.status(500).json({ message: error.message }); //500:serverErr
    logEvent(`error while creating new user${error.message}`, "errLog.log");
  }
};
module.exports = { handleNewUser };
