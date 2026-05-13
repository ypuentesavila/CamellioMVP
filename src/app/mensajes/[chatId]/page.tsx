"use client";

import { use } from "react";
import { useChat } from "@/context";
import { ChatWindow } from "@/components/features/chat/ChatWindow";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { chatId } = use(params);
  const { getChatById } = useChat();
  const chat = getChatById(chatId);

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
        <div className="w-14 h-14 bg-surface rounded-full border border-border flex items-center justify-center mb-3">
          <MessageSquare className="w-7 h-7 text-border" />
        </div>
        <p className="text-sm font-semibold text-text-primary">
          Conversación no encontrada
        </p>
        <Link
          href="/mensajes"
          className="text-xs text-primary font-medium mt-2 hover:underline"
        >
          ← Volver a mensajes
        </Link>
      </div>
    );
  }

  return <ChatWindow chat={chat} />;
}
