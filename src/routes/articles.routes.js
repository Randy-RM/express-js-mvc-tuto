import { Router } from "express";
import {
  createArticle,
  deleteAllArticles,
  deleteArticle,
  getAllArticles,
  getOneArticle,
  updateArticle,
} from "../controllers/articleController.js";

const articleRouter = Router();

//Get all articles
articleRouter.get(`/`, getAllArticles);

//Get one article by articleId
articleRouter.get(`/:articleId`, getOneArticle);

//Create a new article
articleRouter.post(`/add`, createArticle);

//Update article by articleId
articleRouter.put(`/update/:articleId`, updateArticle);

//Delete article by articleId
articleRouter.delete(`/delete/:articleId`, deleteArticle);

//Delete all articles
articleRouter.delete(`/delete`, deleteAllArticles);

export default articleRouter;
