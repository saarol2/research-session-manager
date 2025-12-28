import { prisma } from '../db.js';

export async function getAllSessions() {
  return prisma.session.findMany({
    include: {
      study: true,
      slots: {
        include: {
          bookings: true,
        },
      },
    },
  });
}

export async function getSessionById(id: number) {
  return prisma.session.findUnique({
    where: { id },
    include: {
      study: true,
      slots: {
        include: {
          bookings: true,
        },
      },
    },
  });
}

export async function getSessionsByStudyId(studyId: number) {
  return prisma.session.findMany({
    where: { studyId },
    include: {
      slots: {
        include: {
          bookings: true,
        },
      },
    },
  });
}

export async function createSession(data: {
  studyId: number;
  location: string;
  date: Date;
}) {
  return prisma.session.create({
    data,
    include: {
      study: true,
      slots: true,
    },
  });
}

export async function deleteSession(id: number) {
  return prisma.session.delete({
    where: { id },
  });
}
