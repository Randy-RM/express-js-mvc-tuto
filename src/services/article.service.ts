import { ArticleModel, UserModel } from "../models";
import { isAllowedToManipulate, throwError } from "../utils";
import { IArticle, IUser, PaginatedResponse } from "../types";

export class ArticleService {
  async findById(articleId: string): Promise<IArticle> {
    const article = await ArticleModel.findById(articleId).populate({
      path: "user",
      model: "User",
      select: { _id: 0, username: 1, email: 1 },
    });

    if (!article) {
      throwError(404, `Article with id "${articleId}" not found`);
    }

    return article!;
  }

  async findByUser(
    userId: string,
    cursor?: string,
    limit = 10
  ): Promise<PaginatedResponse<IArticle>> {
    const query: Record<string, unknown> = { user: userId };

    if (cursor) {
      query._id = { $gt: cursor };
    }

    const articles = await ArticleModel.find(query)
      .select({ title: 1, summary: 1, isPublished: 1, isArchived: 1, createdAt: 1 })
      .limit(limit);

    if (!articles || articles.length === 0) {
      throwError(404, "Articles not found");
    }

    return {
      prevCursor: cursor && articles.length > 0 ? String(articles[0]._id) : null,
      nextCursor: articles.length > 0 ? String(articles[articles.length - 1]._id) : null,
      totalResults: articles.length,
      data: articles,
    };
  }

  async findAll(
    cursor?: string,
    limit = 10,
    filters: { isPublished?: boolean; isArchived?: boolean } = {}
  ): Promise<PaginatedResponse<IArticle>> {
    const query: Record<string, unknown> = {};

    if (cursor) {
      query._id = { $gt: cursor };
    }
    if (filters.isPublished !== undefined) {
      query.isPublished = filters.isPublished;
    }
    if (filters.isArchived !== undefined) {
      query.isArchived = filters.isArchived;
    }

    const articles = await ArticleModel.find(query)
      .select({ title: 1, summary: 1, createdAt: 1 })
      .populate({
        path: "user",
        model: "User",
        select: { _id: 0, username: 1, email: 1 },
      })
      .limit(limit);

    if (!articles || articles.length === 0) {
      throwError(404, "Articles not found");
    }

    return {
      prevCursor: cursor && articles.length > 0 ? String(articles[0]._id) : null,
      nextCursor: articles.length > 0 ? String(articles[articles.length - 1]._id) : null,
      totalResults: articles.length,
      data: articles,
    };
  }

  async create(
    userId: string,
    data: { title: string; summary: string; content: string }
  ): Promise<IArticle> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throwError(500, "Something went wrong");
    }

    let article = await ArticleModel.create({ ...data, user });
    article = await article.populate({
      path: "user",
      model: "User",
      select: { _id: 0, username: 1, email: 1 },
    });

    return article;
  }

  async update(
    articleId: string,
    connectedUser: IUser,
    data: {
      title?: string;
      summary?: string;
      content?: string;
      isPublished?: boolean;
      isArchived?: boolean;
    }
  ): Promise<IArticle> {
    const existingArticle = await ArticleModel.findById(articleId);

    if (!existingArticle) {
      throwError(404, `Article with id "${articleId}" not found`);
    }

    if (!isAllowedToManipulate(existingArticle!.user, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    const article = await ArticleModel.findByIdAndUpdate(articleId, data, {
      new: true,
    }).populate({
      path: "user",
      model: "User",
      select: { _id: 0, username: 1, email: 1 },
    });

    return article!;
  }

  async delete(articleId: string, connectedUser: IUser): Promise<IArticle> {
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

    return article!;
  }

  async deleteAll(): Promise<number> {
    const result = await ArticleModel.deleteMany({});
    return result.deletedCount;
  }
}

export const articleService = new ArticleService();
