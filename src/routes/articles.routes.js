const { Router } = require("express");
const passport = require("passport");
const {
  createArticle,
  deleteAllArticles,
  deleteArticle,
  getAllArticles,
  getOneArticle,
  getUserArticles,
  updateArticle,
} = require("../controllers/article.controller.js");
const { authorize } = require("../middlewares");

const { ROLES } = require("../constant");

const articleRouter = Router();

//Get all articles
articleRouter.get(`/`, getAllArticles);

//Get one article by articleId
articleRouter.get(`/:articleId`, getOneArticle);

//Get user articles by userId
articleRouter.get(
  `/:userId/articles`,
  [
    passport.authenticate("jwt", { session: false }),
    authorize([ROLES.ADMIN, ROLES.MODERATOR]),
  ],
  getUserArticles
);

//Create a new article
articleRouter.post(
  `/`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  createArticle
);

//Update article by articleId
articleRouter.put(
  `/:articleId`,
  [
    passport.authenticate("jwt", { session: false }),
    authorize([ROLES.ADMIN, ROLES.MODERATOR]),
  ],
  updateArticle
);

//Delete article by articleId
articleRouter.delete(
  `/:articleId`,
  [
    passport.authenticate("jwt", { session: false }),
    authorize([ROLES.ADMIN, ROLES.MODERATOR]),
  ],
  deleteArticle
);

//Delete all articles
articleRouter.delete(
  `/`,
  [passport.authenticate("jwt", { session: false }), authorize([ROLES.ADMIN])],
  deleteAllArticles
);

module.exports = articleRouter;
