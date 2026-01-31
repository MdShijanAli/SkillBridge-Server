import { Request, Response } from "express";
import { UserService } from "./user.service";
import { formatResultWithPagination } from "../../utils/formatResult";

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userData = req.body;
  const requestedUser = req.user;
  try {
    const updatedUser = await UserService.updateUser(
      userId as string,
      userData,
      requestedUser,
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

const changeUserStatus = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { is_active } = req.body;
  console.log("Status:", is_active);
  try {
    const updatedUser = await UserService.changeUserStatus(
      userId as string,
      is_active,
    );
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const bannedUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { is_banned } = req.body;
  console.log("Status:", is_banned);
  try {
    const updatedUser = await UserService.bannedUser(
      userId as string,
      is_banned,
    );
    res.status(200).json({
      success: true,
      message: "User banned status updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user banned status",
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
      requestedUser,
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
  changeUserStatus,
  bannedUser,
  deleteUser,
};
