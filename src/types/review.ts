import type { Timestamp } from "./common";

export interface Review {
  id: string;
  jobId: string;
  offerId: string;
  authorId: string;
  targetId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}
