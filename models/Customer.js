const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
     firstname: { type: String, required: true, minLength: 1, maxLength: 50 },
     lastname: { type: String, required: true, minLength: 1, maxLength: 50 },
     subscribtionPlan: {
          type: String,
          enum: ["free", "gold", "red"],
          required: true,
     },
     phoneNumber: {
          type: String,
          required: true,
          minlength: 11,
          maxlength: 11,
          trim: true,
     },
});
const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(request) {
     console.log(request);
     const schema = Joi.object({
          firstname: Joi.string().min(3).required(),
          lastname: Joi.string().min(3).required(),
          phoneNumber: Joi.string().trim().min(11).max(11).required(),
          subscribtionPlan: Joi.string().valid("free", "gold", "red"),
     });

     return schema.validate(request);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
