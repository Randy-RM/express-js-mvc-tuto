const { Schema } = require("mongoose");
const dbConnection = require("../config/database");

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter title"],
    },
    content: {
      type: String,
      required: [true, "Please enter content"],
    },
  },
  {
    timestamps: true,
  }
);

const ArticleModel = dbConnection.model("Article", ArticleSchema);

module.exports = ArticleModel;
