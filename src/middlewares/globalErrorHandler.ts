import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Validation Error";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    errorMessage = "Database Error";
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: errorDetails,
  });
}

export default errorHandler;
