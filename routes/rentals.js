const { Rental, validate } = require("../models/Rental");
const { Movie } = require("../models/Movie");
const { Customer } = require("../models/Customer");
// const auth = require("../middleware/auth");
const Fawn = require("fawn");

const mongoose = require("mongoose");
Fawn.init("mongodb://localhost:27017/vidly", "rentals");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
     const rentals = await Rental.find().select("-__v").sort("-dateOut");
     res.send(rentals);
});

router.post("/", async (req, res) => {
     const { error } = validate(req.body);
     if (error) return res.status(400).send(error.details[0].message);

     const customer = await Customer.findById(req.body.customerId);
     if (!customer) return res.status(400).send("Invalid customer.");

     const movie = await Movie.findById(req.body.movieId);
     if (!movie) return res.status(400).send("Invalid movie.");

     let rental = new Rental({
          customer: {
               _id: customer._id,
               name: customer.firstname + " " + customer.lastname,
               phoneNumber: customer.phoneNumber,
          },
          movie: {
               _id: movie._id,
               title: movie.title,
               dailyRentalRate: 100,
          },
     });

     try {
          new Fawn.Task().save("rentals", rental).run();

          res.send(rental);
     } catch (ex) {
          res.status(500).send("Something failed.");
     }
});

router.get("/:id", async (req, res) => {
     const rental = await Rental.findById(req.params.id).select("-__v");

     if (!rental)
          return res
               .status(404)
               .send("The rental with the given ID was not found.");

     res.send(rental);
});

module.exports = router;
