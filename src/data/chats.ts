import type { Chat } from "@/types";

export const chats: Chat[] = [
  {
    id: "c1",
    jobId: "j1",
    offerId: "o1",
    participantIds: ["u1", "u9"],
    lastMessage: "Perfecto. La dirección es Calle 13 #40-25, Apto 401, Kennedy.",
    lastMessageAt: "2026-05-10T17:45:00Z",
    unreadCount: { u1: 1, u9: 0 },
    createdAt: "2026-05-10T16:05:00Z",
  },
  {
    id: "c2",
    jobId: "j2",
    offerId: "o7",
    participantIds: ["u2", "u8"],
    lastMessage: "De acuerdo, $170.000 está bien. ¿Cuándo puede venir?",
    lastMessageAt: "2026-05-09T11:30:00Z",
    unreadCount: { u2: 0, u8: 1 },
    createdAt: "2026-05-08T15:10:00Z",
  },
  {
    id: "c3",
    jobId: "j3",
    offerId: "o3",
    participantIds: ["u5", "u7"],
    lastMessage: "Excelente. Cualquier duda me escribe.",
    lastMessageAt: "2026-05-05T08:30:00Z",
    unreadCount: { u5: 0, u7: 0 },
    createdAt: "2026-04-29T10:45:00Z",
  },
  {
    id: "c4",
    jobId: "j4",
    offerId: "o4",
    participantIds: ["u3", "u10"],
    lastMessage: "¡Muchas gracias Tomás! Un placer trabajar con usted.",
    lastMessageAt: "2026-04-22T17:50:00Z",
    unreadCount: { u3: 0, u10: 0 },
    createdAt: "2026-04-21T10:10:00Z",
  },
];

export function getChatById(id: string): Chat | undefined {
  return chats.find((c) => c.id === id);
}

export function getChatsByUser(userId: string): Chat[] {
  return chats.filter((c) => c.participantIds.includes(userId));
}

export function getChatByJob(jobId: string): Chat | undefined {
  return chats.find((c) => c.jobId === jobId);
}
