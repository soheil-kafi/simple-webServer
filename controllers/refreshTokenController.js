const userDB = {
  users: require("../data/users.json"),
  setUser: function (data) {
    this.users = data;
  },
};
const logEvent = require("../middleware/logEvent");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;
  const foundUser = userDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) {
    return res.sendStatus(403); //Forbidden
  }
  //
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.userName !== decoded.username) {
      return res.sendStatus(403);
    }
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          userName: decoded.userName,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
    logEvent(
      `user ${foundUser.userName} get new access token via refresh token`,
      "usersLog.log"
    );
  });
};
module.exports = { handleRefreshToken };
