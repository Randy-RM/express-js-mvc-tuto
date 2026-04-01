import { prisma } from "../models";
import { isAllowedToManipulate, throwError } from "../utils";
import { IUser, PaginatedResponse } from "../types";
import { Article } from "@prisma/client";

export class ArticleService {
  async findById(articleId: string) {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        user: {
          select: { username: true, email: true },
        },
      },
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
  ): Promise<PaginatedResponse<Article>> {
    const articles = await prisma.article.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        summary: true,
        isPublished: true,
        isArchived: true,
        createdAt: true,
        content: true,
        userId: true,
        updatedAt: true,
      },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: limit,
      orderBy: { id: "asc" },
    });

    if (!articles || articles.length === 0) {
      throwError(404, "Articles not found");
    }

    return {
      prevCursor: cursor && articles.length > 0 ? articles[0].id : null,
      nextCursor: articles.length > 0 ? articles[articles.length - 1].id : null,
      totalResults: articles.length,
      data: articles,
    };
  }

  async findAll(
    cursor?: string,
    limit = 10,
    filters: { isPublished?: boolean; isArchived?: boolean } = {}
  ) {
    const where: Record<string, unknown> = {};

    if (filters.isPublished !== undefined) {
      where.isPublished = filters.isPublished;
    }
    if (filters.isArchived !== undefined) {
      where.isArchived = filters.isArchived;
    }

    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        summary: true,
        createdAt: true,
        user: {
          select: { username: true, email: true },
        },
      },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: limit,
      orderBy: { id: "asc" },
    });

    if (!articles || articles.length === 0) {
      throwError(404, "Articles not found");
    }

    return {
      prevCursor: cursor && articles.length > 0 ? articles[0].id : null,
      nextCursor: articles.length > 0 ? articles[articles.length - 1].id : null,
      totalResults: articles.length,
      data: articles,
    };
  }

  async create(userId: string, data: { title: string; summary: string; content: string }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throwError(500, "Something went wrong");
    }

    const article = await prisma.article.create({
      data: {
        title: data.title,
        summary: data.summary,
        content: data.content,
        userId,
      },
      include: {
        user: {
          select: { username: true, email: true },
        },
      },
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
  ) {
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      throwError(404, `Article with id "${articleId}" not found`);
    }

    if (!isAllowedToManipulate(existingArticle!.userId, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data,
      include: {
        user: {
          select: { username: true, email: true },
        },
      },
    });

    return article;
  }

  async delete(articleId: string, connectedUser: IUser) {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        user: {
          select: { username: true, email: true },
        },
      },
    });

    if (!article) {
      throwError(404, `Article with id "${articleId}" not found`);
    }

    if (!isAllowedToManipulate(article!.userId, connectedUser)) {
      throwError(403, "Forbidden: not authorized to manipulate this resource");
    }

    await prisma.article.delete({ where: { id: articleId } });

    return article!;
  }

  async deleteAll(): Promise<number> {
    const result = await prisma.article.deleteMany({});
    return result.count;
  }
}

export const articleService = new ArticleService();
