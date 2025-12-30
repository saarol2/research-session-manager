export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Study types
export interface Study {
  id: number;
  title: string;
  description: string | null;
  ownerId: number;
  createdAt: string;
  sessions?: Session[];
}

export interface Session {
  id: number;
  studyId: number;
  location: string;
  date: string;
  createdAt: string;
  slots?: TimeSlot[];
}

export interface TimeSlot {
  id: number;
  sessionId: number;
  startTime: string;
  endTime: string;
  capacity: number;
  createdAt: string;
  bookings?: Booking[];
}

export interface Booking {
  id: number;
  slotId: number;
  name: string;
  email: string | null;
  consentAt: string;
  createdAt: string;
}