const express = require("express");
const path = require("path");
const router = express.Router();
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
});
router.get("/news(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "subdir", "news.html"));
});
module.exports = router;
