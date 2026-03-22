import { Request, Response, NextFunction } from "express";
import { ArticleModel, UserModel } from "../models";
import { isAllowedToManipulate, throwError } from "../utils";
import { IUser } from "../types";

export async function getOneArticle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { articleId } = req.params;

  try {
    const article = await ArticleModel.findById(articleId).populate({
      path: "user",
      model: "User",
      select: { _id: 0, username: 1, email: 1 },
    });

    if (!article) {
      throwError(404, `Article with id "${articleId}" not found`);
    }

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
  const { userId } = req.params;
  const { cursor, limit = "10" } = req.query;
  let query: Record<string, unknown> = { user: userId };

  if (cursor) {
    query._id = { $gt: cursor };
  }

  try {
    const articles = await ArticleModel.find(query)
      .select({ title: 1, summary: 1, isPublished: 1, isArchived: 1, createdAt: 1 })
      .limit(Number(limit));

    if (!articles || articles.length === 0) {
      throwError(404, "Articles not found");
    }

    const prevCursor = cursor && articles.length > 0 ? articles[0]._id : null;
    const nextCursor = articles.length > 0 ? articles[articles.length - 1]._id : null;

    res.status(200).json({
      success: true,
      status: 200,
      message: "Articles found",
      data: {
        nextCursor,
        prevCursor,
        totalResults: articles.length,
        data: articles,
      },
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
  const { cursor, limit = "10", isPublished, isArchived } = req.query;
  let query: Record<string, unknown> = {};

  if (cursor) {
    query._id = { $gt: cursor };
  }
  if (isPublished === "true") {
    query.isPublished = true;
  }
  if (isArchived === "true") {
    query.isArchived = true;
  }

  try {
    const articles = await ArticleModel.find(query)
      .select({ title: 1, summary: 1, createdAt: 1 })
      .populate({
        path: "user",
        model: "User",
        select: { _id: 0, username: 1, email: 1 },
      })
      .limit(Number(limit));

    if (!articles || articles.length === 0) {
      throwError(404, "Articles not found");
    }

    const prevCursor = cursor && articles.length > 0 ? articles[0]._id : null;
    const nextCursor = articles.length > 0 ? articles[articles.length - 1]._id : null;

    res.status(200).json({
      success: true,
      status: 200,
      message: "Articles found",
      data: {
        nextCursor,
        prevCursor,
        totalResults: articles.length,
        data: articles,
      },
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
  const userId = (req.user as IUser)._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throwError(500, "Something went wrong");
    }

    const { title, summary, content } = req.body;
    let article = await ArticleModel.create({ title, summary, content, user });
    article = await article.populate({
      path: "user",
      model: "User",
      select: { _id: 0, username: 1, email: 1 },
    });

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
  const { articleId } = req.params;
  const connectedUser = req.user as IUser;

  try {
    const existingArticle = await ArticleModel.findById(articleId);

    if (!existingArticle) {
      throwError(404, `Article with id "${articleId}" not found`);
    }

    if (!isAllowedToManipulate(existingArticle!.user, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    const { title, summary, content, isPublished, isArchived } = req.body;
    const article = await ArticleModel.findByIdAndUpdate(
      articleId,
      { title, summary, content, isPublished, isArchived },
      { new: true }
    ).populate({
      path: "user",
      model: "User",
      select: { _id: 0, username: 1, email: 1 },
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
  const { articleId } = req.params;
  const connectedUser = req.user as IUser;

  try {
    const article = await ArticleModel.findById(articleId).populate({
      path: "user",
      model: "User",
      select: { _id: 0, username: 1, email: 1 },
    });

    if (!article) {
      throwError(404, `Article with id "${articleId}" not found`);
    }

    if (!isAllowedToManipulate(article!.user, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    await article!.deleteOne();

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
    const result = await ArticleModel.deleteMany({});
    res.status(200).json({
      success: true,
      status: 200,
      message: `${result.deletedCount} articles deleted`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
}
