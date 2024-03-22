const { Schema } = require("mongoose");
const dbConnection = require("../config/database.config");

const RoleSchema = new Schema(
  {
    roleName: {
      type: String,
      required: [true, "Please enter role name"],
    },
  },
  {
    timestamps: true,
  }
);

const RoleModel = dbConnection.model("Role", RoleSchema);

module.exports = RoleModel;
