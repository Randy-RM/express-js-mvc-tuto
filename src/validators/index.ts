import { body, param, query } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      status: 422,
      message: "Validation failed",
      data: errors.array(),
    });
    return;
  }
  next();
}

export const signupValidation = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  handleValidationErrors,
];

export const signinValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

export const createArticleValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("summary").trim().notEmpty().withMessage("Summary is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  handleValidationErrors,
];

export const updateArticleValidation = [
  param("articleId").isMongoId().withMessage("Invalid article ID"),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("summary").optional().trim().notEmpty().withMessage("Summary cannot be empty"),
  body("content").optional().trim().notEmpty().withMessage("Content cannot be empty"),
  body("isPublished").optional().isBoolean().withMessage("isPublished must be boolean"),
  body("isArchived").optional().isBoolean().withMessage("isArchived must be boolean"),
  handleValidationErrors,
];

export const createUserValidation = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role").optional().isIn(["admin", "moderator", "user"]).withMessage("Invalid role"),
  handleValidationErrors,
];

export const updateUserValidation = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
  body("username").optional().trim().notEmpty().withMessage("Username cannot be empty"),
  body("email").optional().trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("role").optional().isIn(["admin", "moderator", "user"]).withMessage("Invalid role"),
  handleValidationErrors,
];

export const mongoIdParam = (paramName: string) => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
  handleValidationErrors,
];

export const paginationQuery = [
  query("cursor").optional().isMongoId().withMessage("Invalid cursor"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be 1-100"),
  handleValidationErrors,
];
