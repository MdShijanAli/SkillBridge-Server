import { Response } from "express";

export const formatResultWithPagination = <T>(
  res: Response,
  data: T | null = null,
  message: string = "Request successful",
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
  },
  apiRoute: string = "",
) => {
  const { currentPage, pageSize, totalItems } = pagination;
  const totalPages = Math.ceil(totalItems / pageSize);
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const prevPage = currentPage > 1 ? currentPage - 1 : null;

  const apiURL = process.env.API_URL || "";
  const constructPageLink = (page: number | null) => {
    if (page === null) return null;
    const url = new URL(`${apiURL}${apiRoute}`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", pageSize.toString());
    return url.toString();
  };

  const nextPageLink = constructPageLink(nextPage);
  const prevPageLink = constructPageLink(prevPage);

  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      prevPage: prevPageLink,
      nextPage: nextPageLink,
    },
  });
};
