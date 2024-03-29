const { ArticleModel, UserModel } = require("../models/index.js");
const { isUserAuthorizedToModifyResource } = require("../utils/index.js");

/*
--------------------------
Retrieve one article from 
the database.
--------------------------
*/
async function getOneArticle(req, res) {
  try {
    const { articleId } = req.params;
    const article = await ArticleModel.findById(articleId);
    return res.status(200).json(article);
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
async function getAllArticles(req, res) {
  try {
    const articles = await ArticleModel.find({});
    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/*
--------------------------
Create and save a new article
in the database
--------------------------
*/
async function createArticle(req, res) {
  const { id } = req.user;
  try {
    const user = await UserModel.findById(id);
    const newArticle = await ArticleModel.create({
      ...req.body,
      user: user,
    });
    return res.status(200).json(newArticle);
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
  try {
    const { articleId } = req.params;
    const { id, role } = req.user;
    const article = await ArticleModel.findByIdAndUpdate(articleId, req.body);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    if (
      !isUserAuthorizedToModifyResource({
        userIdInResource: article.user,
        logedUserId: id,
        logedUserRoleName: role.roleName,
      })
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized to modify resource" });
    }

    const updatedArticle = await ArticleModel.findById(articleId);
    return res.status(200).json(updatedArticle);
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
  try {
    const { articleId } = req.params;
    const { id, role } = req.user;

    const article = await ArticleModel.findById(articleId);
    if (
      article &&
      !isUserAuthorizedToModifyResource({
        userIdInResource: article.user,
        logedUserId: id,
        logedUserRoleName: role.roleName,
      })
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized to modify resource" });
    }

    const deletedArticle = await ArticleModel.findByIdAndDelete(articleId);
    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

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
  updateArticle,
};
