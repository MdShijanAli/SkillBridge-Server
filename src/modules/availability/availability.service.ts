import {
  AvailabilityCreateInput,
  AvailabilityUpdateInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const createAvailabilityService = async (
  data: AvailabilityCreateInput,
  requestedUser: any,
) => {
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can create availability");
  }
  const availabilityData = { ...data };
  console.log("Availability Data to be created:", availabilityData);

  const availiblityData = await prisma.availability.create({
    data: availabilityData,
  });
  return availiblityData;
};

const updateAvailabilityService = async (
  data: Partial<AvailabilityUpdateInput>,
  requestedUser: any,
  availabilityId: number,
) => {
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can update availability");
  }
  const availabilityData = { ...data };

  const updatedAvailability = await prisma.availability.update({
    where: { id: availabilityId },
    data: availabilityData,
  });
  return updatedAvailability;
};

const getAllAvailabilities = async (tutorProfileId: number) => {
  const availabilities = await prisma.availability.findMany({
    where: { tutorProfileId },
  });
  return availabilities;
};

const deleteAvailabilityService = async (
  availabilityId: number,
  requestedUser: any,
) => {
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can delete availability");
  }
  await prisma.availability.delete({
    where: { id: availabilityId },
  });
  return { message: "Availability deleted successfully" };
};

const changeStatusService = async (
  availabilityId: number,
  isActive: boolean,
  requestedUser: any,
) => {
  if (requestedUser.role !== UserRole.TUTOR) {
    throw new Error("Only tutors can change availability status");
  }
  const updatedAvailability = await prisma.availability.update({
    where: { id: availabilityId },
    data: { isActive },
  });
  return updatedAvailability;
};

export const availabilityService = {
  createAvailabilityService,
  updateAvailabilityService,
  getAllAvailabilities,
  deleteAvailabilityService,
  changeStatusService,
};
