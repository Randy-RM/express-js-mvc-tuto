const { Schema } = require("mongoose");
const dbConnection = require("../config/database.config");

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
    isPublished: {
      type: Boolean,
      default: false,
    },
    isArchived: { type: Boolean, default: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for article"],
    },
  },
  {
    timestamps: true,
  }
);

const ArticleModel = dbConnection.model("Article", ArticleSchema);

module.exports = ArticleModel;
