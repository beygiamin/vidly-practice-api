const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/User");
const _ = require("lodash");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const validateReq = require("../middleware/validate-req");
router.get("/me", auth, async (req, res) => {
     const user = await User.findById(req.user._id).select("-password");
     res.send(user);
});

router.post("/", validateReq(validate), async (req, res) => {
     const passValid = passwordComplexity().validate(req.body.password);
     if (passValid.error) {
          return res.status(400).send("Password not Complex Enough");
     }

     let user = await User.findOne({ email: req.body.email });
     if (user) return res.status(400).send("User already registered.");

     user = new User(_.pick(req.body, ["name", "email", "password"]));

     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(user.password, salt);

     user = await user.save();
     const token = user.genAuthToken();
     res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

module.exports = router;
