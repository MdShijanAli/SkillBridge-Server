import { Request, Response } from "express";
import { UserService } from "./user.service";
import { formatResultWithPagination } from "../../utils/formatResult";
import { UserRole } from "../../middlewares/auth";
import { User } from "../../../generated/prisma/client";

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userData = req.body;
  const requestedUser = req.user;
  try {
    const updatedUser = await UserService.updateUser(
      userId as string,
      userData,
      requestedUser! as Partial<User>,
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    filter = "",
    role = "",
  } = req.query;
  try {
    const users = await UserService.getAllUsers({
      page: Number(page),
      pageSize: Number(limit),
      search: String(search),
      filter: String(filter),
      role: String(role),
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
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getUserDetails = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await UserService.getUserDetails(userId as string);
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
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const changeUserStat = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { field, value } = req.body;

  const fieldConfig: Record<string, string> = {
    is_active: "User status",
    is_banned: "User banned status",
    emailVerified: "User email verification",
    is_featured: "User featured status",
  };

  try {
    const updatedUser = await UserService.changeUserStat(
      userId as string,
      field as "is_active" | "is_banned" | "emailVerified" | "is_featured",
      value,
    );
    res.status(200).json({
      success: true,
      message: `${fieldConfig[field] || "Field"} updated successfully`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to update ${fieldConfig[field]?.toLowerCase() || "field"}`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const requestedUser = req.user;
  try {
    const deletedUser = await UserService.deleteUser(
      userId as string,
      requestedUser! as Partial<User>,
    );
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const UserController = {
  updateUser,
  getAllUsers,
  getUserDetails,
  changeUserStat,
  deleteUser,
};
