import { prisma } from '../db.js';

export async function getAllStudies() {
  return prisma.study.findMany({
    where: { deletedAt: null },
    include: {
      owner: {
        select: { id: true, email: true, name: true },
      },
      sessions: {
        where: { deletedAt: null },
        include: {
          slots: {
            where: { deletedAt: null },
          },
        },
      },
    },
  });
}

export async function getStudiesByOwnerId(ownerId: number) {
  return prisma.study.findMany({
    where: { ownerId, deletedAt: null },
    include: {
      sessions: {
        where: { deletedAt: null },
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
      },
    },
  });
}

export async function getStudyById(id: number) {
  return prisma.study.findFirst({
    where: { id, deletedAt: null },
    include: {
      owner: {
        select: { id: true, email: true, name: true },
      },
      sessions: {
        where: { deletedAt: null },
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
  return prisma.study.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
