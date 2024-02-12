const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Joi = require("joi");

genresSchema = mongoose.Schema({
     title: { type: String, required: true, minLength: 5, maxLength: 50 },
});

const Genre = mongoose.model("Genre", genresSchema);

router.get("/", async (req, res) => {
     const genres = await Genre.find().sort({ name: 1 });

     res.send(genres);
});

router.get("/:id", async (req, res) => {
     const genre = await Genre.findById(req.params.id);
     if (!genre) {
          return res
               .status(404)
               .send(`Nothing Founded By The Given Id = ${req.params.id}`);
     } else {
          res.send(genre);
     }
});

router.post("/", async (req, res) => {
     const { error } = validateReq(req.body);

     if (error) return res.status(400).send("fuck");

     let genre = new Genre({
          title: req.body.title,
     });

     genre = await genre.save();
     res.send(genre);
});

router.put("/:id", async (req, res) => {
     const { error } = validateReq(req.body);

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

router.delete("/:id", async (req, res) => {
     const genre = await Genre.findOneAndDelete(req.params.id);

     if (!genre) return res.status(404).send("Nothing on DB U ****");

     res.send(`Genre Deleted: ${genre}`);
});

function validateReq(request) {
     console.log(request);
     const schema = Joi.object({
          title: Joi.string().min(3).required(),
     });

     return schema.validate(request);
}

module.exports = router;
