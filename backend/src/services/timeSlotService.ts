import { prisma } from '../db.js';

export async function getAllTimeSlots() {
  return prisma.timeSlot.findMany({
    include: {
      session: true,
      bookings: true,
    },
  });
}

export async function getTimeSlotById(id: number) {
  return prisma.timeSlot.findUnique({
    where: { id },
    include: {
      session: true,
      bookings: true,
    },
  });
}

export async function getTimeSlotsBySessionId(sessionId: number) {
  return prisma.timeSlot.findMany({
    where: { sessionId },
    include: {
      bookings: true,
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
  return prisma.timeSlot.delete({
    where: { id },
  });
}

// Apufunktio: hae aikaväli ja laske vapaat paikat
export async function getTimeSlotWithAvailability(id: number) {
  const slot = await prisma.timeSlot.findUnique({
    where: { id },
    include: {
      bookings: true,
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
