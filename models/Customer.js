const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
     name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
     },
     isGold: {
          type: Boolean,
          default: false,
     },
     phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
     },
});
const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(request) {
     const schema = Joi.object({
          name: Joi.string().min(5).max(50).required(),
          phone: Joi.string().min(5).max(50).required(),
          isGold: Joi.boolean(),
     });

     return schema.validate(request);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
