const mongoose = require("mongoose");
const { Schema, model } = mongoose;

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

const ArticleModel = model("Article", ArticleSchema);

module.exports = ArticleModel;
