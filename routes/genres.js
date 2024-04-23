const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/valiator-obj-id");
const { Genre, validate } = require("../models/Genre");
const winston = require("winston/lib/winston/config");

router.get("/", async (req, res) => {
     const genres = await Genre.find().sort({ name: 1 }).select("-__v");

     res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
     const genre = await Genre.findById(req.params.id);
     if (!genre) {
          return res
               .status(404)
               .send(`Nothing Founded By The Given Id = ${req.params.id}`);
     } else {
          res.send(genre);
     }
});

router.post("/", auth, async (req, res) => {
     const { error } = validate(req.body);

     if (error) return res.status(400).send("fuck");

     let genre = new Genre({
          title: req.body.title,
     });

     genre = await genre.save();
     res.send(genre);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
     const { error } = validate(req.body);

     if (error) return res.status(400).send("fuck");

     const genre = await Genre.findByIdAndUpdate(
          req.params.id,
          {
               title: req.body.title,
          },
          { new: true }
     );

     if (!genre) return res.status(404).send("Nothing on DB U ****");

     res.send(genre);
});

router.delete("/:id", [auth, validateObjectId], async (req, res) => {
     const genre = await Genre.findByIdAndDelete(req.params.id);
     if (!genre) return res.status(404).send("Nothing on DB U ****");

     res.send(genre);
});

module.exports = router;
