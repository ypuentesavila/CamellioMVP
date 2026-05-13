"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Chat, Message, MessageType } from "@/types";
import { chats as mockChats } from "@/data/chats";
import { messages as mockMessages } from "@/data/messages";

const CHATS_KEY = "camellio_chats";
const MESSAGES_KEY = "camellio_messages";

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

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
  ) => Chat;
  sendMessage: (
    chatId: string,
    senderId: string,
    content: string,
    type?: MessageType
  ) => void;
  markChatRead: (chatId: string, userId: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  useEffect(() => {
    setChats(loadFromStorage(CHATS_KEY, mockChats));
    setMessages(loadFromStorage(MESSAGES_KEY, mockMessages));
  }, []);

  useEffect(() => {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

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
    (chatId: string) =>
      messages
        .filter((m) => m.chatId === chatId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
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
    (
      jobId: string,
      participantIds: [string, string],
      offerId?: string
    ): Chat => {
      const existing = chats.find(
        (c) =>
          c.jobId === jobId &&
          c.participantIds.includes(participantIds[0]) &&
          c.participantIds.includes(participantIds[1])
      );
      if (existing) return existing;

      const newChat: Chat = {
        id: `c-${Date.now()}`,
        jobId,
        offerId,
        participantIds,
        unreadCount: {
          [participantIds[0]]: 0,
          [participantIds[1]]: 0,
        },
        createdAt: new Date().toISOString(),
      };
      setChats((prev) => [newChat, ...prev]);
      return newChat;
    },
    [chats]
  );

  const sendMessage = useCallback(
    (
      chatId: string,
      senderId: string,
      content: string,
      type: MessageType = "text"
    ) => {
      const now = new Date().toISOString();
      const newMessage: Message = {
        id: `m-${Date.now()}`,
        chatId,
        senderId,
        content,
        type,
        readBy: [senderId],
        createdAt: now,
      };

      setMessages((prev) => [...prev, newMessage]);

      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c;
          const other = c.participantIds.find((id) => id !== senderId)!;
          return {
            ...c,
            lastMessage: content,
            lastMessageAt: now,
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

  const markChatRead = useCallback((chatId: string, userId: string) => {
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
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
