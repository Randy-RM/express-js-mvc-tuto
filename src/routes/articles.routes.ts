import { Router } from "express";
import passport from "passport";
import {
  createArticle,
  deleteAllArticles,
  deleteArticle,
  getAllArticles,
  getOneArticle,
  getUserArticles,
  updateArticle,
} from "../controllers/article.controller";
import { authorize } from "../middlewares";
import { ROLES } from "../constants";
import {
  createArticleValidation,
  updateArticleValidation,
  mongoIdParam,
  paginationQuery,
} from "../validators";

const articleRouter = Router();

articleRouter.get("/", paginationQuery, getAllArticles);

articleRouter.get("/:articleId", mongoIdParam("articleId"), getOneArticle);

articleRouter.get(
  "/:userId/articles",
  mongoIdParam("userId"),
  passport.authenticate("jwt", { session: false }),
  authorize([ROLES.ADMIN, ROLES.MODERATOR]),
  getUserArticles
);

articleRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize([ROLES.ADMIN]),
  createArticleValidation,
  createArticle
);

articleRouter.put(
  "/:articleId",
  passport.authenticate("jwt", { session: false }),
  authorize([ROLES.ADMIN, ROLES.MODERATOR]),
  updateArticleValidation,
  updateArticle
);

articleRouter.delete(
  "/:articleId",
  mongoIdParam("articleId"),
  passport.authenticate("jwt", { session: false }),
  authorize([ROLES.ADMIN, ROLES.MODERATOR]),
  deleteArticle
);

articleRouter.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize([ROLES.ADMIN]),
  deleteAllArticles
);

export default articleRouter;
