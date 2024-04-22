const { User } = require("../../../models/User");
const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
     it("should return a valid JWT", () => {
          const payload = {
               _id: new mongoose.Types.ObjectId().toHexString(),
               isAdmin: false,
          };
          const user = new User(payload);

          const token = user.genAuthToken();
          const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

          expect(decoded).toMatchObject(payload);
     });
});
