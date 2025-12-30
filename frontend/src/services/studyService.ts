import api from './api';
import { Study } from '../types';

// Get studies owned by logged-in user
export async function getMyStudies(): Promise<Study[]> {
  const response = await api.get<Study[]>('/studies/my');
  return response.data;
}

// Get all public studies
export async function getAllStudies(): Promise<Study[]> {
  const response = await api.get<Study[]>('/studies');
  return response.data;
}

// Get single study by ID
export async function getStudyById(id: number): Promise<Study> {
  const response = await api.get<Study>(`/studies/${id}`);
  return response.data;
}

// Create a new study
export async function createStudy(data: { title: string; description?: string }): Promise<Study> {
  const response = await api.post<Study>('/studies', data);
  return response.data;
}

// Update a study
export async function updateStudy(id: number, data: { title?: string; description?: string }): Promise<Study> {
  const response = await api.put<Study>(`/studies/${id}`, data);
  return response.data;
}

// Delete a study
export async function deleteStudy(id: number): Promise<void> {
  await api.delete(`/studies/${id}`);
}
