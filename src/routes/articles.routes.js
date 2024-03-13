const { Router } = require("express");
const passport = require("passport");
const {
  createArticle,
  deleteAllArticles,
  deleteArticle,
  getAllArticles,
  getOneArticle,
  updateArticle,
} = require("../controllers/articleController.js");

const articleRouter = Router();

//Get all articles
articleRouter.get(`/`, getAllArticles);

//Get one article by articleId
articleRouter.get(`/:articleId`, getOneArticle);

//Create a new article
articleRouter.post(
  `/add`,
  [passport.authenticate("jwt", { session: false })],
  createArticle
);

//Update article by articleId
articleRouter.put(
  `/update/:articleId`,
  [passport.authenticate("jwt", { session: false })],
  updateArticle
);

//Delete article by articleId
articleRouter.delete(
  `/delete/:articleId`,
  [passport.authenticate("jwt", { session: false })],
  deleteArticle
);

//Delete all articles
articleRouter.delete(`/delete`, deleteAllArticles);

module.exports = articleRouter;
