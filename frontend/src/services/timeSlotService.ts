import api from './api';
import { TimeSlot } from '../types';

// Get time slot by ID
export async function getTimeSlotById(id: number): Promise<TimeSlot> {
  const response = await api.get<TimeSlot>(`/timeslots/${id}`);
  return response.data;
}

// Get time slots by session ID
export async function getTimeSlotsBySessionId(sessionId: number): Promise<TimeSlot[]> {
  const response = await api.get<TimeSlot[]>(`/timeslots/session/${sessionId}`);
  return response.data;
}

// Create a new time slot
export async function createTimeSlot(data: {
  sessionId: number;
  startTime: string;
  endTime: string;
  capacity: number;
}): Promise<TimeSlot> {
  const response = await api.post<TimeSlot>('/timeslots', data);
  return response.data;
}

// Update a time slot
export async function updateTimeSlot(
  id: number,
  data: { startTime?: string; endTime?: string; capacity?: number }
): Promise<TimeSlot> {
  const response = await api.put<TimeSlot>(`/timeslots/${id}`, data);
  return response.data;
}

// Delete a time slot
export async function deleteTimeSlot(id: number): Promise<void> {
  await api.delete(`/timeslots/${id}`);
}
