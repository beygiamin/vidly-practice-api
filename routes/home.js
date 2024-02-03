const express = require("express");
const router = express.Router();

router.get("", (req, res) => {
     res.render("index", { appName: "Vidly", message: "Welcome To Vidly" });
});

module.exports = router;
