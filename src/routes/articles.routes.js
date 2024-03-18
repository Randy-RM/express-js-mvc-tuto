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
const { isAuthorOrAdmin } = require("../middlewares/auth.middleware.js");

const articleRouter = Router();

//Get all articles
articleRouter.get(`/all`, getAllArticles);

//Get one article by articleId
articleRouter.get(`/:articleId`, getOneArticle);

//Create a new article
articleRouter.post(
  `/add`,
  [passport.authenticate("jwt", { session: false }), isAuthorOrAdmin],
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
articleRouter.delete(
  `/delete`,
  [passport.authenticate("jwt", { session: false })],
  deleteAllArticles
);

module.exports = articleRouter;
