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

export const TutorProfileController = {
  createTutorProfile,
};
