const { User } = require("../../../models/User");
const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

describe("api/users", () => {
     let server, user;
     beforeEach(() => {
          server = require("../../../index");
          user = {
               name: "user",
               email: "user@gmail.com",
               password: "12345User?", // Password Complexity
          };
     }, 7000);
     afterEach(async () => {
          await server.close();
          await User.deleteMany({});
     });
     describe("POST", () => {
          const exec = async () => {
               return await request(server).post("/api/users").send(user);
          };

          it("should return 400 if name is too short", async () => {
               user.name = "a";
               const res = await exec();
               expect(res.status).toBe(400);
          });
          it("should return 400 if name is too long", async () => {
               user.name = new Array(52).join("a");
               const res = await exec();
               expect(res.status).toBe(400);
          });

          it("should return 400 if password not complex enough", async () => {
               user.password = "12345";
               const res = await exec();
               expect(res.status).toBe(400);
          });

          it("should return 400 if email already registerd", async () => {
               let userInDB = new User(user);
               await userInDB.save();
               const res = await exec();
               expect(res.status).toBe(400);
          });

          it("should save the user to Database", async () => {
               await exec();
               const userInDB = await User.findOne({ email: user.email });
               expect(userInDB).not.toBeNull();
               expect(userInDB).toHaveProperty("email", user.email);
               expect(userInDB).toHaveProperty("name", user.name);
          });

          it(`should hash the user's password`, async () => {
               await exec();
               const userInDB = await User.findOne({ email: user.email });
               const validPassword = await bcrypt.compare(
                    user.password,
                    userInDB.password
               );
               expect(validPassword).toBeTruthy();
          });

          it("should set the x-auth-token of user token", async () => {
               const res = await exec();
               expect(res.headers["x-auth-token"]).not.toBeNull();
          });

          it("should return 200 and user if request is valid", async () => {
               const res = await exec();
               expect(res.status).toBe(200);
               expect(res.body).toHaveProperty("name", user.name);
               expect(res.body).toHaveProperty("email", user.email);
          });
     });

     describe("GET /me", () => {
          let token;
          beforeEach(async () => {
               user = new User(user);
               await user.save();
               token = user.genAuthToken();
          });
          const exec = () => {
               return request(server)
                    .get("/api/users/me")
                    .set("x-auth-token", token);
          };

          it("should return 401 if user not logged in", async () => {
               token = "";
               const res = await exec();
               expect(res.status).toBe(401);
          });

          it("should return 400 if token is invalid", async () => {
               token = jwt.sign("a", "b");
               const res = await exec();
               expect(res.status).toBe(400);
          });

          it("should return user if token is valid", async () => {
               const res = await exec();
               expect(res.status).toBe(200);
               expect(res.body).toHaveProperty("name", user.name);
               expect(res.body).toHaveProperty("email", user.email);
          });
     });
});
