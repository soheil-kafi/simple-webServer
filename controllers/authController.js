const userDB = {
  users: require("../data/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};
const logEvent = require("../middleware/logEvent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");
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
    const roles = Object.values(foundUser.roles);

    //create JWT
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.userName,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.userName },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // saving refresh token with current user
    const otherUsers = userDB.users.filter(
      (per) => per.userName !== foundUser.userName
    );
    const currentUser = { ...foundUser, refreshToken };
    userDB.setUser([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(userDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
    logEvent(`${user} logged in with auth`, "usersLog.log");
  } else {
    logEvent(`${user} cant logged in with auth`, "errLog.log");
    res.sendStatus(401);
  }
};
module.exports = { handleLogin };
