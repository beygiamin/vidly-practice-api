const Joi = require("joi");
const mongoose = require("mongoose");

const moviesSchema = mongoose.Schema({
     title: { type: String, required: true, maxLength: 255 },
     genres: [
          {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
               ref: "Genre",
          },
     ],
});
const Movie = mongoose.model("Movie", moviesSchema);
function validateReq(request) {
     const schema = Joi.object({
          title: Joi.string().min(3).required(),
          genres: Joi.array().min(1).required(),
     });

     return schema.validate(request);
}

exports.Movie = Movie;

exports.validate = validateReq;
