const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Joi = require("joi");

moviesSchema = mongoose.Schema({
     title: { type: String, required: true, maxLength: 50 },
     genres: [
          {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
               ref: "Genre",
          },
     ],
});

const Movie = mongoose.model("Movie", moviesSchema);

router.get("/", async (req, res) => {
     const movies = await Movie.find()
          .populate("genres", "title -_id")
          .sort({ title: 1 })
          .select("title");

     res.send(movies);
});

router.get("/:id", async (req, res) => {
     const movie = await Movie.findById(req.params.id);
     if (!movie) {
          return res
               .status(404)
               .send(`Nothing Founded By The Given Id = ${req.params.id}`);
     } else {
          res.send(movie);
     }
});

router.post("/", async (req, res) => {
     const { error } = validateReq(req.body);

     if (error) return res.status(400).send("fuck");

     let movie = new Movie({
          title: req.body.title,
          genres: req.body.genres,
     });

     movie = await movie.save();
     res.send(movie);
});

router.put("/:id", async (req, res) => {
     const { error } = validateReq(req.body);

     if (error) return res.status(400).send("fuck");

     const movie = await Movie.findByIdAndUpdate(
          req.params.id,
          {
               title: req.body.title,
               genres: req.body.genres,
          },
          { new: true }
     );

     if (!movie) return res.status(404).send("Nothing on DB U ****");

     res.send(movie);
});

router.delete("/:id", async (req, res) => {
     const movie = await Movie.findOneAndDelete(req.params.id);

     if (!movie) return res.status(404).send("Nothing on DB U ****");

     res.send(`Movie Deleted: ${movie}`);
});

function validateReq(request) {
     console.log(request);
     const schema = Joi.object({
          title: Joi.string().min(3).required(),
          genres: Joi.array().min(1).required(),
     });

     return schema.validate(request);
}

module.exports = router;
