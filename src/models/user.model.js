const bcrypt = require("bcrypt");
const { Schema } = require("mongoose");
const dbConnection = require("../config/database");

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please enter user name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
  role: { type: Schema.Types.ObjectId, ref: "Role" },
});

UserSchema.methods.isUserPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const UserModel = dbConnection.model("User", UserSchema);

module.exports = UserModel;
