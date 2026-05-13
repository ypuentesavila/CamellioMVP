import type { PortfolioItem, Timestamp } from "./common";

export type UserRole = "worker" | "employer";

export interface WorkerProfile {
  category: string;
  skills: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  verified: boolean;
  available: boolean;
  portfolio: PortfolioItem[];
}

export interface EmployerProfile {
  companyName?: string;
  jobsPosted: number;
  verified: boolean;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  location: string;
  bio?: string;
  createdAt: Timestamp;
  workerProfile?: WorkerProfile;
  employerProfile?: EmployerProfile;
}
