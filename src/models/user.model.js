const bcrypt = require("bcrypt");
const { Schema } = require("mongoose");
const dbConnection = require("../config/database");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const UserModel = dbConnection.model("user", UserSchema);

module.exports = UserModel;
