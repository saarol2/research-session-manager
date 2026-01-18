import api from './api';
import { Session } from '../types';

// Get session by ID
export async function getSessionById(id: number): Promise<Session> {
  const response = await api.get<Session>(`/sessions/${id}`);
  return response.data;
}

// Get sessions by study ID
export async function getSessionsByStudyId(studyId: number): Promise<Session[]> {
  const response = await api.get<Session[]>(`/sessions/study/${studyId}`);
  return response.data;
}

// Create a new session
export async function createSession(data: {
  studyId: number;
  location: string;
  date: string;
}): Promise<Session> {
  const response = await api.post<Session>('/sessions', data);
  return response.data;
}

// Delete a session
export async function deleteSession(id: number): Promise<void> {
  await api.delete(`/sessions/${id}`);
}
