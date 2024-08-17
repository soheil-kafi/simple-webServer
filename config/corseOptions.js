const whitelist = ["https://www.google.com", `http://localhost:3500`];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
      console.log(origin);
    } else {
      callback(new Error("not allowed by sior"));
    }
  },
  optionsSuccessStatus: 200,
};
module.exports = corsOptions;
