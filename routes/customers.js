const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/Customer");

router.get("/", async (req, res) => {
     const customer = await Customer.find().sort({ _id: -1 }).select("-__v");

     res.send(customer);
});

router.get("/:id", async (req, res) => {
     const customer = await Customer.findById(req.params.id);
     if (!customer) {
          return res
               .status(404)
               .send(`No One Founded By The Given Id = ${req.params.id}`);
     } else {
          res.send(customer);
     }
});

router.post("/", async (req, res) => {
     const { error } = validate(req.body);

     if (error) return res.status(400).send("Data Not Valid");

     let customer = new Customer({
          name: req.body.name,
          isGold: req.body.isGold,
          phone: req.body.phone,
     });

     customer = await customer.save();
     res.send(customer);
});

router.put("/:id", async (req, res) => {
     const { error } = validate(req.body);

     if (error) return res.status(400).send("Data Not Valid");

     const customer = await Customer.findByIdAndUpdate(
          req.params.id,
          {
               name: req.body.name,
               isGold: req.body.isGold,
               phone: req.body.phone,
          },
          { new: true }
     );

     if (!customer) return res.status(404).send("Nothing on DB U ****");

     res.send(customer);
});

router.delete("/:id", async (req, res) => {
     const customer = await Customer.findOneAndDelete(req.params.id);

     if (!customer) return res.status(404).send("Nothing on DB U ****");

     res.send(`Customer Deleted: ${customer}`);
});

module.exports = router;
