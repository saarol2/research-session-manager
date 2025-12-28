import { prisma } from '../db.js';

export async function getAllTimeSlots() {
  return prisma.timeSlot.findMany({
    where: { deletedAt: null },
    include: {
      session: true,
      bookings: {
        where: { deletedAt: null },
      },
    },
  });
}

export async function getTimeSlotById(id: number) {
  return prisma.timeSlot.findFirst({
    where: { id, deletedAt: null },
    include: {
      session: true,
      bookings: {
        where: { deletedAt: null },
      },
    },
  });
}

export async function getTimeSlotsBySessionId(sessionId: number) {
  return prisma.timeSlot.findMany({
    where: { sessionId, deletedAt: null },
    include: {
      bookings: {
        where: { deletedAt: null },
      },
    },
  });
}

export async function createTimeSlot(data: {
  sessionId: number;
  startTime: Date;
  endTime: Date;
  capacity: number;
}) {
  return prisma.timeSlot.create({
    data,
    include: {
      session: true,
    },
  });
}

export async function updateTimeSlot(
  id: number,
  data: {
    startTime?: Date;
    endTime?: Date;
    capacity?: number;
  }
) {
  return prisma.timeSlot.update({
    where: { id },
    data,
  });
}

export async function deleteTimeSlot(id: number) {
  return prisma.timeSlot.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

// Apufunktio: hae aikaväli ja laske vapaat paikat
export async function getTimeSlotWithAvailability(id: number) {
  const slot = await prisma.timeSlot.findFirst({
    where: { id, deletedAt: null },
    include: {
      bookings: {
        where: { deletedAt: null },
      },
      session: {
        include: {
          study: true,
        },
      },
    },
  });

  if (!slot) return null;

  return {
    ...slot,
    bookedCount: slot.bookings.length,
    availableCount: slot.capacity - slot.bookings.length,
    isFull: slot.bookings.length >= slot.capacity,
  };
}
