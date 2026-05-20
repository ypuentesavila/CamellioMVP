import type { Timestamp } from "./common";
import type { User } from "./user";

export type OfferStatus =
  | "pending"
  | "negotiating"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface Offer {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  proposedPrice: number;
  estimatedDuration: string;
  message: string;
  status: OfferStatus;
  counterOfferPrice?: number;
  counterOfferNote?: string;
  negotiationRound: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  worker?: Pick<User, "id" | "name" | "avatar" | "location" | "workerProfile">;
}
