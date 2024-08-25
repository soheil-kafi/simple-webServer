const userDB = {
  users: require("../data/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};
const logEvent = require("../middleware/logEvent");
const fsPromises = require("fs").promises;
const path = require("path");
const handleLogout = async (req, res) => {
  //on client also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No Content
  }

  const refreshToken = cookies.jwt;
  // Is refreshToken in db
  const foundUser = userDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204); //Forbidden
  }
  //delete the refresh token from db
  const otherUsers = userDB.users.filter(
    (per) => per.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  userDB.setUser([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    JSON.stringify(userDB.users)
  );
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.sendStatus(204);
  logEvent(
    `user ${foundUser.userName} logout and clear JWT cookie`,
    "usersLog.log"
  );
};
module.exports = { handleLogout };
