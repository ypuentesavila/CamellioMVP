import type { Timestamp } from "./common";

export type MessageType = "text" | "offer_update" | "system";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: MessageType;
  readBy: string[];
  createdAt: Timestamp;
}

export interface Chat {
  id: string;
  jobId: string;
  offerId?: string;
  participantIds: [string, string];
  lastMessage?: string;
  lastMessageAt?: Timestamp;
  unreadCount: Record<string, number>;
  createdAt: Timestamp;
}
