import { Request, Response, NextFunction } from "express";
import { articleService } from "../services";
import { IUser } from "../types";

export async function getOneArticle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const article = await articleService.findById(String(req.params.articleId));

    res.status(200).json({
      success: true,
      status: 200,
      message: "Article found",
      data: article,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserArticles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { cursor, limit = "10" } = req.query;
    const data = await articleService.findByUser(
      String(req.params.userId),
      cursor as string | undefined,
      Number(limit)
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: "Articles found",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllArticles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { cursor, limit = "10", isPublished, isArchived } = req.query;
    const data = await articleService.findAll(cursor as string | undefined, Number(limit), {
      isPublished: isPublished === "true" ? true : undefined,
      isArchived: isArchived === "true" ? true : undefined,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Articles found",
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createArticle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = String((req.user as IUser).id);
    const { title, summary, content } = req.body;
    const article = await articleService.create(userId, { title, summary, content });

    res.status(201).json({
      success: true,
      status: 201,
      message: "Article created",
      data: article,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateArticle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, summary, content, isPublished, isArchived } = req.body;
    const article = await articleService.update(String(req.params.articleId), req.user as IUser, {
      title,
      summary,
      content,
      isPublished,
      isArchived,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "Article updated successfully",
      data: article,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteArticle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const article = await articleService.delete(String(req.params.articleId), req.user as IUser);

    res.status(200).json({
      success: true,
      status: 200,
      message: "Article deleted successfully",
      data: article,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAllArticles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const deletedCount = await articleService.deleteAll();

    res.status(200).json({
      success: true,
      status: 200,
      message: `${deletedCount} articles deleted`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
}
