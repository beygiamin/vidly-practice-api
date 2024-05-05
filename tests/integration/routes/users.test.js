const { User } = require("../../../models/User");
const request = require("supertest");

describe("api/users", () => {
     let server;
     beforeEach(() => {
          server = require("../../../index");
     });
     afterEach(async () => {
          await server.close();
          await User.deleteMany({});
     });
     describe("POST", () => {
          let user;
          beforeEach(() => {
               user = {
                    name: "user",
                    email: "user@gmail.com",
                    password: "12345User?", // Password Complexity
               };
          });
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
               user.password = "a";
               const res = await exec();
               expect(res.status).toBe(400);
          });

          it("should return 400 if email already registerd", async () => {
               let userInDB = new User(user);
               await userInDB.save();
               const res = await exec();
               expect(res.status).toBe(400);
          });
     });
});
