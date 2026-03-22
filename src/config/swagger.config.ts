import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express MVC Tuto API",
      version: "3.0.0",
      description:
        "RESTful API built with Express 5, TypeScript, Mongoose, and Passport JWT authentication. " +
        "Features role-based access control (RBAC), input validation, pagination, and a service-layer architecture.",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API base path",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from the signin endpoint",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            username: { type: "string", example: "john_doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            isUserActive: { type: "boolean", example: true },
            role: { type: "string", enum: ["user", "moderator", "admin"], example: "user" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Article: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0e" },
            title: { type: "string", example: "My First Article" },
            summary: { type: "string", example: "A brief summary of the article" },
            content: { type: "string", example: "Full article content here..." },
            isPublished: { type: "boolean", example: false },
            isArchived: { type: "boolean", example: false },
            user: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            status: { type: "integer" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            status: { type: "integer", example: 200 },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                nextCursor: { type: "string", nullable: true },
                prevCursor: { type: "string", nullable: true },
                totalResults: { type: "integer" },
                data: { type: "array", items: { type: "object" } },
              },
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            status: { type: "integer", example: 422 },
            message: { type: "string", example: "Validation failed" },
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  value: { type: "string" },
                  msg: { type: "string" },
                  path: { type: "string" },
                  location: { type: "string" },
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            status: { type: "integer" },
            message: { type: "string" },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication & account management" },
      { name: "Users", description: "User CRUD operations (requires authentication)" },
      { name: "Articles", description: "Article CRUD operations" },
    ],
  },
  apis: ["./src/docs/swagger/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
