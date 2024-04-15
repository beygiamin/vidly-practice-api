const Joi = require("joi");
const mongoose = require("mongoose");

const genresSchema = mongoose.Schema({
     title: { type: String, required: true, minLength: 5, maxLength: 50 },
});
const Genre = mongoose.model("Genre", genresSchema);
exports.Genre = Genre;

function validateReq(request) {
     const schema = Joi.object({
          title: Joi.string().min(3).required(),
     });

     return schema.validate(request);
}
exports.validate = validateReq;
