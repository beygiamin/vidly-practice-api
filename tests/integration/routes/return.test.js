const { Rental } = require("../../../models/Rental");
const { User } = require("../../../models/User");
const mongoose = require("mongoose");
const request = require("supertest");
const moment = require("moment");

describe("/api/returns", () => {
     let server;
     let rental;
     let customerId, movieId;
     let token;

     const exec = () => {
          return request(server)
               .post("/api/returns")
               .set("x-auth-token", token)
               .send({ customerId, movieId });
     };
     beforeEach(async () => {
          customerId = new mongoose.Types.ObjectId().toHexString();
          movieId = new mongoose.Types.ObjectId().toHexString();
          server = require("../../../index");
          token = new User().genAuthToken();
          rental = new Rental({
               customer: {
                    _id: customerId,
                    name: "customer",
                    phone: "12345678910", // At least 11 characters
               },
               movie: {
                    _id: movieId,
                    title: "movie",
                    dailyRentalRate: 2,
               },
          });
          await rental.save();
     }, 15000);
     afterEach(async () => {
          await server.close();

          await Rental.deleteMany({});
     });
     it("should return 401 if client is not logged in", async () => {
          token = "";
          const res = await exec();
          expect(res.status).toBe(401);
     });
     it("should return 400 if movieId is not valid", async () => {
          movieId = "";
          const res = await exec();
          expect(res.status).toBe(400);
     });
     it("should return 400 if customerId is not valid", async () => {
          customerId = "";
          const res = await exec();
          expect(res.status).toBe(400);
     });
     it("should return 404 if no rental found for this  customer/movie", async () => {
          await Rental.deleteMany({});
          const res = await exec();
          expect(res.status).toBe(404);
     });

     it("should return 400 if  return already processed", async () => {
          rental.dateReturned = new Date();
          await rental.save();
          const res = await exec();
          expect(res.status).toBe(400);
     });

     it("should return 200 if  request is valid ", async () => {
          const res = await exec();
          expect(res.status).toBe(200);
     });

     it("should set date returned", async () => {
          await exec();
          const rentalInDb = await Rental.findById(rental._id);
          const diff = new Date() - rentalInDb.dateReturned;
          expect(diff).toBeLessThan(15 * 1000);
     });

     it("should calculate rental fee date returned", async () => {
          rental.dateOut = moment().add(-7, "days").toDate();
          await rental.save();
          await exec();
          const rentalInDb = await Rental.findById(rental._id);

          expect(rentalInDb.rentalFee).toBe(14);
     });

     it("should return rental", async () => {
          const res = await exec();
          expect(Object.keys(res.body)).toEqual(
               expect.arrayContaining([
                    "dateOut",
                    "dateReturned",
                    "rentalFee",
                    "customer",
                    "movie",
               ])
          );
     });
});
