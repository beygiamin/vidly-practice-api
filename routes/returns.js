//POST /api/returns { customerId, movieId }

//return 401 if client is not logged in
//return 400 if customer Id isnt provoded
//return 400 if movie Id isnt provoded
//return 404 if no rental found for this  customer/movie

//
const express = require("express");
const { Rental, validate } = require("../models/Rental");
const router = express.Router();
const auth = require("../middleware/auth");
const moment = require("moment");
const validateReq = require("../middleware/validate-req");

//
router.post("/", [auth, validateReq(validate)], async (req, res) => {
     const rental = await Rental.findOne({
          "customer._id": req.body.customerId,
          "movie._id": req.body.movieId,
     });
     if (!rental)
          return res.status(404).send("rental with given ids not found");

     if (rental.dateReturned)
          return res.status(400).send("rental already processed");

     rental.dateReturned = new Date();

     const rentalDays = moment().diff(rental.dateOut, "days");
     rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
     await rental.save();

     return res.status(200).send(rental);
});

module.exports = router;
