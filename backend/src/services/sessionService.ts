import { prisma } from '../db.js';

export async function getAllSessions() {
  return prisma.session.findMany({
    where: { deletedAt: null },
    include: {
      study: true,
      slots: {
        where: { deletedAt: null },
        include: {
          bookings: {
            where: { deletedAt: null },
          },
        },
      },
    },
  });
}

export async function getSessionById(id: number) {
  return prisma.session.findFirst({
    where: { id, deletedAt: null },
    include: {
      study: true,
      slots: {
        where: { deletedAt: null },
        include: {
          bookings: {
            where: { deletedAt: null },
          },
        },
      },
    },
  });
}

export async function getSessionsByStudyId(studyId: number) {
  return prisma.session.findMany({
    where: { studyId, deletedAt: null },
    include: {
      slots: {
        where: { deletedAt: null },
        include: {
          bookings: {
            where: { deletedAt: null },
          },
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
  return prisma.session.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
