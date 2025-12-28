import { prisma } from '../db.js';

export async function getAllBookings() {
  return prisma.booking.findMany({
    include: {
      slot: {
        include: {
          session: {
            include: {
              study: true,
            },
          },
        },
      },
    },
  });
}

export async function getBookingById(id: number) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      slot: {
        include: {
          session: true,
        },
      },
    },
  });
}

export async function getBookingsBySlotId(slotId: number) {
  return prisma.booking.findMany({
    where: { slotId },
  });
}

export async function createBooking(data: {
  slotId: number;
  name: string;
  email?: string;
  consentAt: Date;
}) {
  // Check capacity before creating booking
  const slot = await prisma.timeSlot.findUnique({
    where: { id: data.slotId },
    include: { bookings: true },
  });

  if (!slot) {
    throw new Error('Slot not found');
  }

  if (slot.bookings.length >= slot.capacity) {
    throw new Error('Slot is full');
  }

  return prisma.booking.create({
    data,
    include: {
      slot: true,
    },
  });
}

export async function deleteBooking(id: number) {
  return prisma.booking.delete({
    where: { id },
  });
}
