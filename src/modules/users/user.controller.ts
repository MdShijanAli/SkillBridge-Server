import { Request, Response } from "express";
import { UserService } from "./user.service";
import { formatResultWithPagination } from "../../utils/formatResult";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    formatResultWithPagination(res, users, "Users fetched successfully");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      data: null,
    });
  }
};

export const UserController = {
  getAllUsers,
};
