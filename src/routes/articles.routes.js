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
const { authorize } = require("../middlewares/auth.middleware.js");

const { ROLES } = require("../constant");

const articleRouter = Router();

//Get all articles
articleRouter.get(`/`, getAllArticles);

//Get one article by articleId
articleRouter.get(`/:articleId`, getOneArticle);

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
    authorize([ROLES.ADMIN, ROLES.AUTHOR]),
  ],
  updateArticle
);

//Delete article by articleId
articleRouter.delete(
  `/:articleId`,
  [
    passport.authenticate("jwt", { session: false }),
    authorize([ROLES.ADMIN, ROLES.AUTHOR]),
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
