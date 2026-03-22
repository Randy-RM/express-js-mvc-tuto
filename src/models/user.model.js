const bcrypt = require("bcrypt");
const { Schema } = require("mongoose");
const dbConnection = require("../config/database.config");
const { ROLES } = require("../constants");

const validRoles = [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN];

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
  isUserActive: {
    type: Boolean,
    default: false,
  },
  uniqueString: {
    type: String,
  },
  role: {
    type: String,
    enum: validRoles,
    default: "user",
  },
});

// Hide sensitive fields when converting to JSON
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.uniqueString;
  delete user.__v;
  return user;
};

UserSchema.methods.isUserPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const UserModel = dbConnection.model("User", UserSchema);

module.exports = UserModel;
