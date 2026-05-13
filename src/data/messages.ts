import type { Message } from "@/types";

export const messages: Message[] = [
  // ─── c1: Paula ↔ Carlos (plomería, j1) ──────────────────
  {
    id: "m1",
    chatId: "c1",
    senderId: "u1",
    content: "Buenos días Paula, vi su publicación sobre la tubería. ¿Podría pasar a revisar el miércoles?",
    type: "text",
    readBy: ["u1", "u9"],
    createdAt: "2026-05-10T16:05:00Z",
  },
  {
    id: "m2",
    chatId: "c1",
    senderId: "u9",
    content: "¡Hola Carlos! Claro, el miércoles está perfecto. ¿A qué hora le queda cómodo?",
    type: "text",
    readBy: ["u1", "u9"],
    createdAt: "2026-05-10T16:22:00Z",
  },
  {
    id: "m3",
    chatId: "c1",
    senderId: "u1",
    content: "¿Le parece bien a las 10am? Así puedo llevar todos los materiales necesarios para la reparación.",
    type: "text",
    readBy: ["u1", "u9"],
    createdAt: "2026-05-10T16:35:00Z",
  },
  {
    id: "m4",
    chatId: "c1",
    senderId: "u9",
    content: "Perfecto. La dirección es Calle 13 #40-25, Apto 401, Kennedy.",
    type: "text",
    readBy: ["u9"],
    createdAt: "2026-05-10T17:45:00Z",
  },

  // ─── c2: Juan Pablo ↔ Andrés (electricidad, j2 — negociación) ──
  {
    id: "m5",
    chatId: "c2",
    senderId: "u2",
    content: "Buenos días Juan Pablo. Mi precio por la instalación de los 3 tomacorrientes es de $200.000 COP, incluye materiales y mano de obra.",
    type: "text",
    readBy: ["u2", "u8"],
    createdAt: "2026-05-08T15:10:00Z",
  },
  {
    id: "m6",
    chatId: "c2",
    senderId: "u8",
    content: "Hola Andrés. Está un poco por encima de mi presupuesto. ¿Podría hacerlo por $160.000?",
    type: "text",
    readBy: ["u2", "u8"],
    createdAt: "2026-05-08T16:00:00Z",
  },
  {
    id: "m7",
    chatId: "c2",
    senderId: "u2",
    content: "Entiendo, pero los materiales (cable THHN, tomas Legrand y la canaleta) cuestan alrededor de $60.000. Le puedo dejar en $170.000, ese es mi mínimo.",
    type: "text",
    readBy: ["u2", "u8"],
    createdAt: "2026-05-09T09:15:00Z",
  },
  {
    id: "m8",
    chatId: "c2",
    senderId: "u8",
    content: "De acuerdo, $170.000 está bien. ¿Cuándo puede venir?",
    type: "text",
    readBy: ["u8"],
    createdAt: "2026-05-09T11:30:00Z",
  },

  // ─── c3: María ↔ Valentina (pintura, j3 — en progreso) ─────
  {
    id: "m9",
    chatId: "c3",
    senderId: "u5",
    content: "Buenos días María. Mañana comienzo temprano, a las 7:30am. Ya compré la pintura Corona blanco hueso que acordamos.",
    type: "text",
    readBy: ["u5", "u7"],
    createdAt: "2026-05-04T18:00:00Z",
  },
  {
    id: "m10",
    chatId: "c3",
    senderId: "u7",
    content: "Perfecto Valentina. Le dejo las llaves con el portero, su nombre es don Hernán. ¿Cuántos días calcula que dura el trabajo?",
    type: "text",
    readBy: ["u5", "u7"],
    createdAt: "2026-05-04T19:10:00Z",
  },
  {
    id: "m11",
    chatId: "c3",
    senderId: "u5",
    content: "Con la sala y el comedor son aproximadamente 2 días completos. El primer día aplico el estuco y el segundo día las dos manos de pintura.",
    type: "text",
    readBy: ["u5", "u7"],
    createdAt: "2026-05-04T19:30:00Z",
  },
  {
    id: "m12",
    chatId: "c3",
    senderId: "u7",
    content: "Excelente. Cualquier duda me escribe.",
    type: "text",
    readBy: ["u5", "u7"],
    createdAt: "2026-05-05T08:30:00Z",
  },

  // ─── c4: Tomás ↔ Luisa (limpieza, j4 — completado) ─────────
  {
    id: "m13",
    chatId: "c4",
    senderId: "u3",
    content: "Hola Tomás, ya terminé la limpieza completa. ¿Podría subir a revisar antes de que me vaya?",
    type: "text",
    readBy: ["u3", "u10"],
    createdAt: "2026-04-22T16:45:00Z",
  },
  {
    id: "m14",
    chatId: "c4",
    senderId: "u10",
    content: "Ya voy subiendo. Un momento.",
    type: "text",
    readBy: ["u3", "u10"],
    createdAt: "2026-04-22T17:00:00Z",
  },
  {
    id: "m15",
    chatId: "c4",
    senderId: "u10",
    content: "Todo quedó perfecto Luisa, muchas gracias. Le transfiero los $140.000 ahora mismo por Nequi.",
    type: "text",
    readBy: ["u3", "u10"],
    createdAt: "2026-04-22T17:20:00Z",
  },
  {
    id: "m16",
    chatId: "c4",
    senderId: "u3",
    content: "¡Muchas gracias Tomás! Un placer trabajar con usted. Cualquier cosita que necesite, con gusto.",
    type: "text",
    readBy: ["u3", "u10"],
    createdAt: "2026-04-22T17:50:00Z",
  },
];

export function getMessagesByChat(chatId: string): Message[] {
  return messages
    .filter((m) => m.chatId === chatId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
