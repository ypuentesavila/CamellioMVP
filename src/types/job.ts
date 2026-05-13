import type { Timestamp } from "./common";

export type JobStatus =
  | "draft"
  | "open"
  | "in_progress"
  | "completed"
  | "cancelled";

export type JobUrgency = "flexible" | "this_week" | "urgent";

export interface JobBudget {
  min: number;
  max: number;
}

export interface Job {
  id: string;
  employerId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: JobBudget;
  urgency: JobUrgency;
  status: JobStatus;
  offerCount: number;
  acceptedOfferId?: string;
  images?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
