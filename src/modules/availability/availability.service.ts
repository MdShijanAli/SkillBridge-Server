import { AvailabilityCreateInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const createAvailabilityService = async (
  data: AvailabilityCreateInput,
  requestedUser: any,
) => {
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can create availability");
  }
  const availabilityData = { ...data, tutorProfileId: requestedUser.id };

  const availiblityData = await prisma.availability.create({
    data: availabilityData,
  });
  return availiblityData;
};

const getAllAvailabilities = async () => {
  const availabilities = await prisma.availability.findMany();
  return availabilities;
};

export const availabilityService = {
  createAvailabilityService,
  getAllAvailabilities,
};
