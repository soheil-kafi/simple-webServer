const { allowedOrigins } = require("./allowedOrigins");
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
      // console.log(origin);
    } else {
      callback(new Error("not allowed by sior"));
    }
  },
  optionsSuccessStatus: 200,
};
module.exports = corsOptions;
