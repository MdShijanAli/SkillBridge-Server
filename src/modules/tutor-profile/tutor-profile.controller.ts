import { Request, Response } from "express";
import { TutorProfileService } from "./tutor-profile.service";

const createTutorProfile = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  try {
    const tutorProfile = await TutorProfileService.createTutorProfile(
      req.body,
      requestedUser,
    );
    res.status(201).json({
      success: true,
      message: "Tutor profile created successfully",
      data: tutorProfile,
    });
  } catch (error: any) {
    console.error("Error creating tutor profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create tutor profile",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const updateTutorProfile = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  try {
    const tutorProfile = await TutorProfileService.updateTutorProfile(
      req.body,
      requestedUser,
    );
    res.status(200).json({
      success: true,
      message: "Tutor profile updated successfully",
      data: tutorProfile,
    });
  } catch (error: any) {
    console.error("Error updating tutor profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update tutor profile",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

const getTutorProfile = async (req: Request, res: Response) => {
  const requestedUser = req.user;
  try {
    const tutorProfile =
      await TutorProfileService.getTutorProfile(requestedUser);
    res.status(200).json({
      success: true,
      message: "Tutor profile retrieved successfully",
      data: tutorProfile,
    });
  } catch (error: any) {
    console.error("Error retrieving tutor profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tutor profile",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

export const TutorProfileController = {
  createTutorProfile,
  updateTutorProfile,
  getTutorProfile,
};
