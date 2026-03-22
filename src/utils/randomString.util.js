const crypto = require("crypto");

function randomStringGenerator(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

module.exports = randomStringGenerator;
