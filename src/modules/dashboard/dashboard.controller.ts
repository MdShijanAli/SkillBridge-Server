import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

const GetStudentDashboardStats = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  try {
    const response =
      await DashboardService.GetStudentDashboardStats(requestedUser);
    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: response,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve dashboard stats",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

export const DashboardController = {
  GetStudentDashboardStats,
};
