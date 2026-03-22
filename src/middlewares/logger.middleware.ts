import { Request, Response, NextFunction } from "express";

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
} as const;

const METHOD_COLORS: Record<string, string> = {
  GET: COLORS.green,
  POST: COLORS.cyan,
  PUT: COLORS.yellow,
  PATCH: COLORS.magenta,
  DELETE: COLORS.red,
};

const STATUS_COLORS: Record<string, string> = {
  "2": COLORS.green,
  "3": COLORS.blue,
  "4": COLORS.yellow,
  "5": COLORS.red,
};

function colorize(color: string, text: string): string {
  return `${color}${text}${COLORS.reset}`;
}

export function logger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const methodColor = METHOD_COLORS[req.method] || COLORS.white;
    const statusColor = STATUS_COLORS[String(res.statusCode)[0]] || COLORS.white;

    const timestamp = colorize(COLORS.gray, `[${new Date().toISOString()}]`);
    const method = colorize(methodColor, req.method.padEnd(7));
    const status = colorize(statusColor, String(res.statusCode));
    const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const time = colorize(COLORS.gray, `${duration}ms`);

    console.log(`${timestamp} ${method} ${status} ${url} ${time}`);
  });

  next();
}
