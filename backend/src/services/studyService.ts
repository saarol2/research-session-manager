import { prisma } from '../db.js';

export async function getAllStudies() {
  return prisma.study.findMany({
    include: {
      owner: {
        select: { id: true, email: true, name: true },
      },
      sessions: {
        include: {
          slots: true,
        },
      },
    },
  });
}

export async function getStudiesByOwnerId(ownerId: number) {
  return prisma.study.findMany({
    where: { ownerId },
    include: {
      sessions: {
        include: {
          slots: {
            include: {
              bookings: true,
            },
          },
        },
      },
    },
  });
}

export async function getStudyById(id: number) {
  return prisma.study.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, email: true, name: true },
      },
      sessions: {
        include: {
          slots: {
            include: {
              bookings: true,
            },
          },
        },
      },
    },
  });
}

export async function createStudy(data: { title: string; description?: string; ownerId: number }) {
  return prisma.study.create({
    data,
    include: {
      owner: {
        select: { id: true, email: true, name: true },
      },
    },
  });
}

export async function updateStudy(
  id: number,
  data: { title?: string; description?: string }
) {
  return prisma.study.update({
    where: { id },
    data,
  });
}

export async function deleteStudy(id: number) {
  return prisma.study.delete({
    where: { id },
  });
}
