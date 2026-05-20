"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Chat, Message, MessageType } from "@/types";
import { api, getToken } from "@/lib/api";

interface ChatContextValue {
  chats: Chat[];
  messages: Message[];
  getChatById: (chatId: string) => Chat | undefined;
  getChatsByUser: (userId: string) => Chat[];
  getMessagesByChat: (chatId: string) => Message[];
  getTotalUnread: (userId: string) => number;
  createChat: (
    jobId: string,
    participantIds: [string, string],
    offerId?: string
  ) => Promise<Chat>;
  sendMessage: (
    chatId: string,
    senderId: string,
    content: string,
    type?: MessageType
  ) => Promise<void>;
  markChatRead: (chatId: string, userId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!getToken()) return;
    api.get<Chat[]>('/chats').then(setChats).catch(() => {});
  }, []);

  const getChatById = useCallback(
    (chatId: string) => chats.find((c) => c.id === chatId),
    [chats]
  );

  const getChatsByUser = useCallback(
    (userId: string) =>
      chats
        .filter((c) => c.participantIds.includes(userId))
        .sort((a, b) => {
          const aTime = a.lastMessageAt ?? a.createdAt;
          const bTime = b.lastMessageAt ?? b.createdAt;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        }),
    [chats]
  );

  const getMessagesByChat = useCallback(
    (chatId: string) => {
      const cached = messages.filter((m) => m.chatId === chatId);
      if (cached.length > 0) return cached.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      api.get<Message[]>(`/messages?chatId=${chatId}`)
        .then((fetched) => {
          setMessages((prev) => {
            const withoutThis = prev.filter((m) => m.chatId !== chatId);
            return [...withoutThis, ...fetched];
          });
        })
        .catch(() => {});
      return [];
    },
    [messages]
  );

  const getTotalUnread = useCallback(
    (userId: string) =>
      chats
        .filter((c) => c.participantIds.includes(userId))
        .reduce((sum, c) => sum + (c.unreadCount[userId] ?? 0), 0),
    [chats]
  );

  const createChat = useCallback(
    async (
      jobId: string,
      participantIds: [string, string],
      offerId?: string
    ): Promise<Chat> => {
      const existing = chats.find(
        (c) =>
          c.jobId === jobId &&
          c.participantIds.includes(participantIds[0]) &&
          c.participantIds.includes(participantIds[1])
      );
      if (existing) return existing;
      const chat = await api.post<Chat>('/chats', { jobId, participantIds, offerId });
      setChats((prev) => [chat, ...prev]);
      return chat;
    },
    [chats]
  );

  const sendMessage = useCallback(
    async (
      chatId: string,
      senderId: string,
      content: string,
      type: MessageType = 'text'
    ) => {
      const msg = await api.post<Message>('/messages', { chatId, content, type });
      setMessages((prev) => [...prev, msg]);
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c;
          const other = c.participantIds.find((id) => id !== senderId)!;
          return {
            ...c,
            lastMessage: content,
            lastMessageAt: msg.createdAt,
            unreadCount: {
              ...c.unreadCount,
              [other]: (c.unreadCount[other] ?? 0) + 1,
            },
          };
        })
      );
    },
    []
  );

  const markChatRead = useCallback(async (chatId: string, userId: string) => {
    await api.patch(`/chats/${chatId}/read`, {});
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, unreadCount: { ...c.unreadCount, [userId]: 0 } }
          : c
      )
    );
    setMessages((prev) =>
      prev.map((m) =>
        m.chatId === chatId && !m.readBy.includes(userId)
          ? { ...m, readBy: [...m.readBy, userId] }
          : m
      )
    );
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        getChatById,
        getChatsByUser,
        getMessagesByChat,
        getTotalUnread,
        createChat,
        sendMessage,
        markChatRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
