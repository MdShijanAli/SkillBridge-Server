import { Response } from "express";

export const formatResultWithPagination = <T>(
  res: Response,
  data: T | null = null,
  message: string = "Request successful",
) => {
  const currentPage = 1;
  const pageSize = data && Array.isArray(data) ? data.length : 0;
  const totalItems = data && Array.isArray(data) ? data.length : 0;
  const totalPages = pageSize > 0 ? 1 : 0;

  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    },
  });
};
