import { TutorProfileCreateInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const createTutorProfile = async (
  data: TutorProfileCreateInput,
  requestedUser: any,
) => {
  console.log("Requested User in Service:", requestedUser);
  if (requestedUser && requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can create tutor profiles");
  }
  const profileData = { ...data, userId: requestedUser.id };

  const tutorProfile = await prisma.tutorProfile.create({
    data: profileData,
  });
  return tutorProfile;
};

const updateTutorProfile = async (
  data: Partial<TutorProfileCreateInput>,
  requestedUser: any,
) => {
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can update tutor profiles");
  }
  const tutorProfile = await prisma.tutorProfile.update({
    where: { userId: requestedUser.id },
    data,
  });
  return tutorProfile;
};

const getTutorProfile = async (requestedUser: any) => {
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can access tutor profiles");
  }
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: requestedUser.id },
  });
  return tutorProfile;
};

export const TutorProfileService = {
  createTutorProfile,
  updateTutorProfile,
  getTutorProfile,
};
