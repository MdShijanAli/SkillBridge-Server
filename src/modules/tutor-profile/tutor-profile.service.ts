import {
  TutorProfileCreateInput,
  TutorProfileUpdateInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const createTutorProfile = async (
  data: TutorProfileCreateInput & { categoryIds?: number[] },
  requestedUser: any,
) => {
  console.log("Requested User in Service:", requestedUser);
  if (requestedUser && requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can create tutor profiles");
  }

  // Extract categoryIds from data
  const { categoryIds, ...profileData } = data;

  // Create the tutor profile
  const tutorProfile = await prisma.tutorProfile.create({
    data: {
      ...profileData,
      userId: requestedUser.id,
    },
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
      availability: true,
    },
  });

  // If categoryIds are provided, create category associations
  if (categoryIds && categoryIds.length > 0) {
    await prisma.tutorCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        tutorProfileId: tutorProfile.id,
        categoryId,
      })),
    });

    // Fetch and return the updated profile with categories
    return await prisma.tutorProfile.findUnique({
      where: { id: tutorProfile.id },
      include: {
        user: true,
        categories: {
          include: {
            category: true,
          },
        },
        availability: true,
      },
    });
  }

  return tutorProfile;
};

const updateTutorProfile = async (
  data: Partial<TutorProfileUpdateInput> & { categoryIds?: number[] },
  requestedUser: any,
) => {
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can update tutor profiles");
  }
  console.log("Updated Profile Data:", data);

  const { categoryIds, ...profileData } = data;

  if (categoryIds !== undefined) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: requestedUser.id },
      select: { id: true },
    });

    if (!tutorProfile) {
      throw new Error("Tutor profile not found");
    }

    await prisma.tutorCategory.deleteMany({
      where: { tutorProfileId: tutorProfile.id },
    });

    if (categoryIds.length > 0) {
      await prisma.tutorCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          tutorProfileId: tutorProfile.id,
          categoryId,
        })),
      });
    }
  }

  const updatedProfile = await prisma.tutorProfile.update({
    where: { userId: requestedUser.id },
    data: profileData,
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
      availability: true,
    },
  });

  return updatedProfile;
};

const getTutorProfile = async (requestedUser: any) => {
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can access tutor profiles");
  }
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: requestedUser.id },
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
      availability: true,
    },
  });
  return tutorProfile;
};

export const TutorProfileService = {
  createTutorProfile,
  updateTutorProfile,
  getTutorProfile,
};
