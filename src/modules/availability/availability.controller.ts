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

export const AvalablityController = {
  createAvailabilityService,
  getAllAvailabilities,
};
