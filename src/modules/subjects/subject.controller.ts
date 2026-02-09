import { Request, Response } from "express";
import { SubjectService } from "./subject.service";

const getAllPopularSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await SubjectService.GetAllPopularSubjects();
    res.status(200).json({
      success: true,
      message: "Popular subjects fetched successfully",
      data: subjects,
    });
  } catch (error: any) {
    console.error("Error fetching popular subjects:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular subjects",
      error: error.message?.split("\n").pop().trim() || error.message || error,
    });
  }
};

export const SubjectController = {
  getAllPopularSubjects,
};
