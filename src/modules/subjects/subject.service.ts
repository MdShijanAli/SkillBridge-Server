import { prisma } from "../../lib/prisma";

const GetAllPopularSubjects = async () => {
  // Fetch all tutor profiles with active users
  const tutorProfiles = await prisma.tutorProfile.findMany({
    where: {
      user: {
        role: "TUTOR",
        is_active: true,
        is_banned: false,
      },
    },
    select: {
      subjects: true,
    },
  });

  // Aggregate subjects and count occurrences
  const subjectMap: Record<string, number> = {};

  tutorProfiles.forEach((profile) => {
    profile.subjects.forEach((subject) => {
      const normalizedSubject = subject.trim();
      if (normalizedSubject) {
        subjectMap[normalizedSubject] =
          (subjectMap[normalizedSubject] || 0) + 1;
      }
    });
  });

  // Convert to array and sort by popularity (tutor count)
  const popularSubjects = Object.entries(subjectMap)
    .map(([name, tutorCount]) => ({
      name,
      tutorCount,
    }))
    .sort((a, b) => b.tutorCount - a.tutorCount);

  return popularSubjects;
};

export const SubjectService = {
  GetAllPopularSubjects,
};
