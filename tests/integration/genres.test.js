const request = require("supertest");
const { Genre } = require("../../models/Genre");
const { User } = require("../../models/User");
const mongoose = require("mongoose");

let server;

describe("/api/genres", () => {
     beforeEach(() => {
          jest.setTimeout(10000);
          server = require("../../index");
     });
     afterEach(async () => {
          await server.close();
          await Genre.deleteMany({});
     });

     describe("GET /", () => {
          it("should return all genres", async () => {
               const genres = [{ title: "genre1" }, { title: "genre2" }];

               await Genre.collection.insertMany(genres);

               const res = await request(server).get("/api/genres");

               expect(res.status).toBe(200);
               expect(res.body.length).toBe(2);
               expect(res.body.some(g => g.title === "genre1")).toBeTruthy();
               expect(res.body.some(g => g.title === "genre2")).toBeTruthy();
          });
     });

     describe("GET /ID", () => {
          it("should return a genre of a valid given Id", async () => {
               const genre = new Genre({ title: "genre1" });
               await genre.save();
               const res = await request(server).get(
                    "/api/genres/" + genre._id
               );

               expect(res.status).toBe(200);
               expect(res.body).toHaveProperty("title", genre.title);
          });

          it("should return 404 if invalid id passed to it", async () => {
               const res = await request(server).get("/api/genres/1");

               expect(res.status).toBe(404);
          });

          it("should return 404 if no genre with the given id exists", async () => {
               const id = new mongoose.Types.ObjectId().toHexString();
               const res = await request(server).get("/api/genres/" + id);

               expect(res.status).toBe(404);
          });
     });

     describe("PUT /ID", () => {
          let token, newTitle, genre, id;

          const exec = async () => {
               return await request(server)
                    .put("/api/genres/" + id)
                    .send({ title: newTitle })
                    .set("x-auth-token", token);
          };

          beforeEach(async () => {
               // Before each test we need to create a genre and
               // put it in the database.
               genre = new Genre({ title: "genre1" });
               await genre.save();

               token = new User().genAuthToken();
               id = genre._id;
               newTitle = "updatedName";
          });

          it("should update the genre of valid given id", async () => {
               await exec();
               const updatedGenre = await Genre.findById(genre._id);
               expect(updatedGenre.title).toBe(newTitle);
          });

          it("should return the 401 if client is not logged in", async () => {
               token = "";
               const res = await exec();

               expect(res.status).toBe(401);
          });

          it("should return 400 if genre is less than 3 characters", async () => {
               newTitle = "12";
               const res = await exec();

               expect(res.status).toBe(400);
          });

          it("should return 400 if genre is more than 50 characters", async () => {
               newTitle = new Array(52).join("a");

               const res = await exec();

               expect(res.status).toBe(400);
          });
          it("should return 404 if id is invalid", async () => {
               id = 1;

               const res = await exec();

               expect(res.status).toBe(404);
          });

          it("should return 404 if genre with the given id was not found", async () => {
               id = new mongoose.Types.ObjectId().toHexString();

               const res = await exec();

               expect(res.status).toBe(404);
          });
     });

     describe("POST ", () => {
          let token, title;

          const exec = async () => {
               return await request(server)
                    .post("/api/genres/")
                    .set("x-auth-token", token)
                    .send({ title });
          };

          beforeEach(async () => {
               title = "genre1";
               token = new User().genAuthToken();
          });

          it("should return 400 if genre is more than 50 characters", async () => {
               title = new Array(52).join("a");
               const res = await exec();
               expect(res.status).toBe(400);
          });

          it("should return 400 if genre is less than 3 characters", async () => {
               title = "12";
               const res = await exec();
               expect(res.status).toBe(400);
          });

          it("should return 401 if user is not logged in", async () => {
               token = "";
               const res = await exec();
               expect(res.status).toBe(401);
          });

          it("should save the genre if it is valid", async () => {
               await exec();

               const genre = await Genre.find({ title: "genre1" });

               expect(genre).not.toBeNull();
          });

          it("should return the genre if it is valid", async () => {
               const res = await exec();

               expect(res.body).toHaveProperty("_id");
               expect(res.body).toHaveProperty("title", "genre1");
          });
     });

     describe("DELETE /ID", () => {
          let token, id, genre;

          const exec = async () => {
               return await request(server)
                    .delete("/api/genres/" + id)
                    .set("x-auth-token", token);
          };

          beforeEach(async () => {
               genre = new Genre({ title: "genre1" });
               id = genre._id;
               await genre.save();
               token = new User().genAuthToken();
          });

          it("should return 401 if user is not logged in", async () => {
               token = "";
               const res = await exec();
               expect(res.status).toBe(401);
          });

          it("should return 404 if genre  not  found", async () => {
               id = new mongoose.Types.ObjectId().toHexString();

               const res = await exec();
               expect(res.status).toBe(404);
          });

          it("should return 404 if id is not Valid ", async () => {
               id = 1;

               const res = await exec();
               expect(res.status).toBe(404);
          });

          it("should delete the genre if input is valid", async () => {
               await exec();

               const genreInDb = await Genre.findById(id);

               expect(genreInDb).toBeNull();
          });

          it("should return the removed genre", async () => {
               const res = await exec();

               expect(res.body).toHaveProperty("_id", genre._id.toHexString());
               expect(res.body).toHaveProperty("title", genre.title);
          });
     });
});
