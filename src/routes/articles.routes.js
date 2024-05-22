const { Router } = require("express");
const passport = require("passport");
const {
  createArticle,
  deleteAllArticles,
  deleteArticle,
  getAllArticles,
  getOneArticle,
  updateArticle,
} = require("../controllers/article.controller.js");
const {
  isAdmin,
  isAuthorOrAdmin,
} = require("../middlewares/auth.middleware.js");

const articleRouter = Router();

//Get all articles
articleRouter.get(`/`, getAllArticles);

//Get one article by articleId
articleRouter.get(`/:articleId`, getOneArticle);

//Create a new article
articleRouter.post(
  `/`,
  [passport.authenticate("jwt", { session: false }), isAuthorOrAdmin],
  createArticle
);

//Update article by articleId
articleRouter.put(
  `/:articleId`,
  [passport.authenticate("jwt", { session: false }), isAuthorOrAdmin],
  updateArticle
);

//Delete article by articleId
articleRouter.delete(
  `/:articleId`,
  [passport.authenticate("jwt", { session: false }), isAuthorOrAdmin],
  deleteArticle
);

//Delete all articles
articleRouter.delete(
  `/`,
  [passport.authenticate("jwt", { session: false }), isAdmin],
  deleteAllArticles
);

module.exports = articleRouter;
