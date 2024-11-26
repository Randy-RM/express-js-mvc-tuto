const { ArticleModel, UserModel } = require("../models");
const { isAllowedToManipulate, throwError } = require("../utils");

/*
--------------------------
Retrieve one article from 
the database.
--------------------------
*/
async function getOneArticle(req, res, next) {
  const { articleId } = req.params;

  try {
    const article = await ArticleModel.findById(articleId).populate({
      path: "user",
      model: "User",
      select: { _id: 0, username: 1, email: 1 },
    });

    if (!article) {
      throwError(404, `Article with id "${articleId}" not found`);
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: `Article found`,
      data: article,
    });
  } catch (error) {
    return next(error);
  }
}

/*
--------------------------
Retrieve user articles from 
the database.
--------------------------
*/
async function getUserArticles(req, res, next) {
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
      throwError(404, `Articles not found`);
    }

    // Extract the next and previous cursor from the result
    const prevCursor = cursor && articles.length > 0 ? articles[0]._id : null;
    const nextCursor =
      articles.length > 0 ? articles[articles.length - 1]._id : null;

    return res.status(200).json({
      success: true,
      status: 200,
      message: `Articles found`,
      data: {
        nextCursor,
        prevCursor,
        totalResults: articles.length,
        data: articles,
      },
    });
  } catch (error) {
    return next(error);
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
      throwError(404, `Articles not found`);
    }

    // Extract the next and previous cursor from the result
    const prevCursor = cursor && articles.length > 0 ? articles[0]._id : null;
    const nextCursor =
      articles.length > 0 ? articles[articles.length - 1]._id : null;

    return res.status(200).json({
      success: true,
      status: 200,
      message: `Articles found`,
      data: {
        nextCursor,
        prevCursor,
        totalResults: articles.length,
        data: articles,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/*
--------------------------
Create and save a new article
in the database
--------------------------
*/
async function createArticle(req, res, next) {
  const { id: userId } = req.user;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throwError(500, `Something went wrong`);
    }

    let article = await ArticleModel.create({ ...req.body, user });
    article = await article.populate({
      path: "user",
      model: "User",
      select: { _id: 0, username: 1, email: 1 },
    });

    return res.status(201).json({
      success: true,
      status: 200,
      message: `Article created`,
      data: article,
    });
  } catch (error) {
    return next(error);
  }
}

/*
--------------------------
Update article by the id 
in the request
--------------------------
*/
async function updateArticle(req, res, next) {
  const { articleId } = req.params;
  const { user: connectedUser } = req;

  try {
    const article = await ArticleModel.findById(articleId);

    if (!article) {
      throwError(404, `Article with id "${articleId}" not found`);
    }

    if (!isAllowedToManipulate(article.user, connectedUser)) {
      throwError(401, `Unauthorized to manipulate resource`);
    }

    await article.updateOne({ ...req.body });

    return res.status(200).json({ message: "Article updated successfully" });
  } catch (error) {
    return next(error);
  }
}

/*
--------------------------
Delete article with 
the specified id 
in the request
--------------------------
*/
async function deleteArticle(req, res, next) {
  const { articleId } = req.params;
  const { user: connectedUser } = req;

  try {
    const article = await ArticleModel.findById(articleId);

    if (!article) {
      throwError(404, `Article with id "${articleId}" not found`);
    }

    if (!isAllowedToManipulate(article.user, connectedUser)) {
      throwError(401, `Unauthorized to manipulate resource`);
    }

    await article.deleteOne();

    return res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    return next(error);
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
