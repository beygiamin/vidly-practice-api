const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.get("/", (req, res) => {
     res.send(genres);
});

router.get("/:id", (req, res) => {
     const genre = genres.find(it => req.params.id == it.id);
     if (!genre)
          res.status(404).send(
               `Nothing Founded By The Given Id = ${req.params.id}`
          );
     else res.send(genre);
});

router.post("/", (req, res) => {
     const { error } = validateReq(req.body);

     if (error) return res.status(400).send("fuck");

     const genre = {
          id: (genres.length + 1).toString(),
          title: req.body.title,
     };
     console.log(genre);

     genres.push(genre);

     res.send(genre);
});
const genres = [
     {
          id: "1",
          title: "Scary",
     },
     {
          id: "2",
          title: "Action",
     },
     {
          id: "3",
          title: "Sci-Fi",
     },
     {
          id: "4",
          title: "Fantasy",
     },
     {
          id: "5",
          title: "Romance",
     },
     {
          id: "6",
          title: "Comedy",
     },
];

function validateReq(request) {
     console.log(request);
     const schema = Joi.object({
          title: Joi.string().min(3).required(),
     });

     return schema.validate(request);
}

module.exports = router;
