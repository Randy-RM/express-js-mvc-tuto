const ArticleModel = require("../models/article.model.js");

/*
--------------------------
Retrieve one article from 
the database.
--------------------------
*/
async function getOneArticle(req, res, next) {
  return res.send("One article");
}

/*
--------------------------
Retrieve all articles from 
the database.
--------------------------
*/
async function getAllArticles(req, res, next) {
  return res.send("All articles");
}

/*
--------------------------
Create and save a new article
in the database
--------------------------
*/
async function createArticle(req, res, next) {
  try {
    const newArticle = await ArticleModel.create(req.body);
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
async function updateArticle(req, res, next) {
  return res.send("Article is updated");
}

/*
--------------------------
Delete article with 
the specified id 
in the request
--------------------------
*/
async function deleteArticle(req, res, next) {
  return res.send("Article is deleted");
}

/*
--------------------------
Delete all articles from 
the database.
--------------------------
*/
async function deleteAllArticles(req, res, next) {
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
