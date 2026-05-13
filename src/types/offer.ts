import type { Timestamp } from "./common";

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
}
