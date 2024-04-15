const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/User");
const _ = require("lodash");
// router.get("/", async (req, res) => {
//      const genres = await Genre.find().sort({ name: 1 });

//      res.send(genres);
// });

// router.get("/:id", async (req, res) => {
//      const genre = await Genre.findById(req.params.id);
//      if (!genre) {
//           return res
//                .status(404)
//                .send(`Nothing Founded By The Given Id = ${req.params.id}`);
//      } else {
//           res.send(genre);
//      }
// });

router.post("/", async (req, res) => {
     const { error } = validate(req.body);
     if (error) return res.status(400).send(error.details[0].message);

     let user = await User.findOne({ email: req.body.email });
     if (user) return res.status(400).send("User already registered.");

     user = new User(_.pick(req.body, ["name", "email", "password"]));

     user = await user.save();
     res.send(user);
});

// router.put("/:id", async (req, res) => {
//      const { error } = validate(req.body);

//      if (error) return res.status(400).send("fuck");

//      const genre = await Genre.findByIdAndUpdate(
//           req.params.id,
//           {
//                title: req.body.title,
//           },
//           { new: true }
//      );

//      if (!genre) return res.status(404).send("Nothing on DB U ****");

//      res.send(genre);
// });

// router.delete("/:id", async (req, res) => {
//      const genre = await Genre.findOneAndDelete(req.params.id);

//      if (!genre) return res.status(404).send("Nothing on DB U ****");

//      res.send(`Genre Deleted: ${genre}`);
// });

module.exports = router;
