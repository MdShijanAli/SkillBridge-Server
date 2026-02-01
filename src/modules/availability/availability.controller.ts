import { Request, Response } from "express";
import { availabilityService } from "./availability.service";

const createAvailabilityService = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  try {
    const result = await availabilityService.createAvailabilityService(
      req.body,
      requestedUser,
    );
    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error creating availability:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create availability",
      error: error.message,
    });
  }
};

const getAllAvailabilities = async (req: Request, res: Response) => {
  try {
    const result = await availabilityService.getAllAvailabilities();
    res.status(200).json({
      success: true,
      message: "Availabilities fetched successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error fetching availabilities:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch availabilities",
      error: error.message,
    });
  }
};

const updateAvailabilityService = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  const availabilityId = parseInt(req.params.id);
  try {
    const result = await availabilityService.updateAvailabilityService(
      req.body,
      requestedUser,
      availabilityId,
    );
    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error updating availability:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update availability",
      error: error.message,
    });
  }
};

const deleteAvailabilityService = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  const availabilityId = parseInt(req.params.id);
  try {
    const result = await availabilityService.deleteAvailabilityService(
      availabilityId,
      requestedUser,
    );
    res.status(200).json({
      success: true,
      message: "Availability deleted successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error deleting availability:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete availability",
      error: error.message,
    });
  }
};

const changeStatusService = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  const availabilityId = parseInt(req.params.id);
  const { isActive } = req.body;
  try {
    const result = await availabilityService.changeStatusService(
      availabilityId,
      isActive,
      requestedUser,
    );
    res.status(200).json({
      success: true,
      message: "Availability status changed successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error changing availability status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to change availability status",
      error: error.message,
    });
  }
};

export const AvalablityController = {
  createAvailabilityService,
  getAllAvailabilities,
  updateAvailabilityService,
  deleteAvailabilityService,
  changeStatusService,
};
