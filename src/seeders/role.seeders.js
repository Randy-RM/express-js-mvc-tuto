require("dotenv").config();
const Role = require("../models/role.model");
const mongoose = require("mongoose");

//get your mongoose string
const dbUrl = process.env.MONGOHQ_URL;

//create your array. i inserted only 1 object here
const rolses = [
  new Role({ roleName: "admin" }),
  new Role({ roleName: "author" }),
  new Role({ roleName: "user" }),
];
//connect mongoose
mongoose
  .connect(String(dbUrl), {})
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db in development environment");
  });

const clearAndCreateNewRoleCollection = async () => {
  await Role.deleteMany({})
    .then((roleCollection) => {
      // Number of documents deleted
      console.log("Role deleted", roleCollection.deletedCount);
      //save your data. this is an async operation
      //after you make sure you seeded all the rolses, disconnect automatically
      rolses.map(async (role, index) => {
        await role.save();
        if (index === rolses.length - 1) {
          console.log("seed done");
          mongoose.disconnect();
        }
      });
    })
    .catch(() => console.log("Role collection deletion failed"));
};

clearAndCreateNewRoleCollection();
