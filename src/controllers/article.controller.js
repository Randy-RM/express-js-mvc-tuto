const { ArticleModel, UserModel } = require("../models/index.js");
const { isAllowedToManipulate, throwError } = require("../utils/index.js");

/*
--------------------------
Retrieve one article from 
the database.
--------------------------
*/
async function getOneArticle(req, res) {
  const { articleId } = req.params;

  try {
    const article = await ArticleModel.findById(articleId).populate({
      path: "user",
      model: "User",
      select: { _id: 0, username: 1, email: 1 },
    });

    if (!article) {
      return res
        .status(404)
        .json({ message: `Article with id "${articleId}" not found` });
    }

    return res.status(200).json(article);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Retrieve user articles from 
the database.
--------------------------
*/
async function getUserArticles(req, res) {
  const { userId } = req.params;
  const { cursor, limit = 10 } = req.query;
  let query = {};

  // If a cursor is provided, add it to the query
  if (cursor) {
    query = { _id: { $gt: cursor } };
  }

  try {
    const articles = await ArticleModel.find({ user: userId, ...query })
      .select({
        id: 1,
        title: 1,
        summary: 1,
        isPublished: 1,
        isArchived: 1,
        createdAt: 1,
      })
      .limit(Number(limit));

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: "Articles not found" });
    }

    // Extract the next and previous cursor from the result
    const prevCursor = cursor && articles.length > 0 ? articles[0]._id : null;
    const nextCursor =
      articles.length > 0 ? articles[articles.length - 1]._id : null;

    return res.status(200).json({
      nextCursor,
      prevCursor,
      totalResults: articles.length,
      data: articles,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Retrieve all articles from 
the database.
--------------------------
*/
async function getAllArticles(req, res, next) {
  const {
    cursor,
    limit = 10,
    sort = "desc",
    isPublished = false,
    isArchived = false,
  } = req.query;
  let query = {};

  // If a cursor is provided, add it to the query
  if (cursor) {
    query = { ...query, _id: { $gt: cursor } };
  }
  if (isPublished) {
    query = { ...query, isPublished: isPublished };
  }
  if (isArchived) {
    query = { ...query, isArchived: isArchived };
  }

  try {
    // Fetch articles using the cursor-based query
    const articles = await ArticleModel.find({ ...query })
      .select({ title: 1, summary: 1, createdAt: 1 })
      .populate({
        path: "user",
        model: "User",
        select: { _id: 0, username: 1, email: 1 },
      })
      .limit(Number(limit));

    if (!articles || articles.length === 0) {
      throwError(404, "Articles not found");
    }

    // Extract the next and previous cursor from the result
    const prevCursor = cursor && articles.length > 0 ? articles[0]._id : null;
    const nextCursor =
      articles.length > 0 ? articles[articles.length - 1]._id : null;

    return res.status(200).json({
      nextCursor,
      prevCursor,
      totalResults: articles.length,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
}

/*
--------------------------
Create and save a new article
in the database
--------------------------
*/
async function createArticle(req, res) {
  const { id: userId } = req.user;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "This user not found in database" });
    }

    const article = { ...req.body, user };
    await ArticleModel.create(article);

    return res.status(201).json({ message: "Article created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Update article by the id 
in the request
--------------------------
*/
async function updateArticle(req, res) {
  const { articleId } = req.params;
  const { user: connectedUser } = req;

  try {
    const article = await ArticleModel.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (!isAllowedToManipulate(article.user, connectedUser)) {
      return res
        .status(401)
        .json({ message: "Unauthorized to manipulate resource" });
    }

    await article.updateOne({ ...req.body });

    return res.status(200).json({ message: "Article updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Delete article with 
the specified id 
in the request
--------------------------
*/
async function deleteArticle(req, res) {
  const { articleId } = req.params;
  const { user: connectedUser } = req;

  try {
    const article = await ArticleModel.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (!isAllowedToManipulate(article.user, connectedUser)) {
      return res
        .status(401)
        .json({ message: "Unauthorized to manipulate resource" });
    }

    await article.deleteOne();

    return res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Delete all articles from 
the database.
--------------------------
*/
async function deleteAllArticles(req, res) {
  return res.send("Articles are deleted");
}

module.exports = {
  createArticle,
  deleteAllArticles,
  deleteArticle,
  getAllArticles,
  getOneArticle,
  getUserArticles,
  updateArticle,
};
