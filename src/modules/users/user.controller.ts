import { Request, Response } from "express";
import { UserService } from "./user.service";
import { formatResultWithPagination } from "../../utils/formatResult";

const getAllUsers = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search = "", filter = "" } = req.query;
  try {
    const users = await UserService.getAllUsers({
      page: Number(page),
      pageSize: Number(limit),
      search: String(search),
      filter: String(filter),
    });
    formatResultWithPagination(
      res,
      users.data,
      "Users fetched successfully",
      {
        currentPage: Number(page),
        pageSize: Number(limit),
        totalItems: users.total,
      },
      "/users",
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      data: null,
    });
  }
};

const getUserDetails = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await UserService.getUserDetails(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      data: null,
    });
  }
};

export const UserController = {
  getAllUsers,
  getUserDetails,
};
