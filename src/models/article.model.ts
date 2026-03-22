import { Schema } from "mongoose";
import dbConnection from "../config/database.config";
import { IArticle } from "../types";

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, "Please enter title"],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "Please enter summary"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Please enter content"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
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

const ArticleModel = dbConnection.model<IArticle>("Article", ArticleSchema);

export default ArticleModel;
