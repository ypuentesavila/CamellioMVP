"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonChatItem } from "@/components/ui/Skeleton";
import { useAuth } from "@/context";
import { useChat } from "@/context";
import { useJobs } from "@/context";
import { getUserById } from "@/data/users";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useSimulatedLoading } from "@/hooks/useSimulatedLoading";

interface ConversationListProps {
  activeChatId?: string;
}

export function ConversationList({ activeChatId }: ConversationListProps) {
  const { user } = useAuth();
  const { getChatsByUser } = useChat();
  const { getJobById } = useJobs();
  const loading = useSimulatedLoading(900);

  // Fall back to demo user u1 so the UI is usable without auth
  const userId = user?.id ?? "u1";
  const chats = getChatsByUser(userId);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border bg-surface shrink-0">
        <h1 className="text-lg font-bold text-text-primary">Mensajes</h1>
        {!loading && chats.length > 0 && (
          <p className="text-xs text-text-secondary mt-0.5">
            {chats.length} conversación{chats.length !== 1 ? "es" : ""}
          </p>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="animate-fade-in">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonChatItem key={i} />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <EmptyState
              icon={MessageSquare}
              title="Sin conversaciones"
              description="Cuando contactes a un trabajador o empleador, la conversación aparecerá aquí."
              variant="inline"
            />
          </div>
        ) : (
          <div className="animate-fade-in">
          {chats.map((chat) => {
            const otherId = chat.participantIds.find((id) => id !== userId);
            const other = otherId ? getUserById(otherId) : undefined;
            const unread = chat.unreadCount[userId] ?? 0;
            const job = getJobById(chat.jobId);
            const isActive = chat.id === activeChatId;

            return (
              <Link
                key={chat.id}
                href={`/mensajes/${chat.id}`}
                className={cn(
                  "flex items-start gap-3 px-4 py-3.5 border-b border-border transition-colors",
                  isActive
                    ? "bg-primary-light border-l-2 border-l-primary"
                    : "hover:bg-background"
                )}
              >
                {/* Avatar + unread badge */}
                <div className="relative shrink-0">
                  <Avatar name={other?.name ?? "?"} size="md" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p
                      className={cn(
                        "text-sm truncate",
                        unread > 0
                          ? "font-bold text-text-primary"
                          : "font-semibold text-text-primary"
                      )}
                    >
                      {other?.name ?? "Usuario"}
                    </p>
                    {chat.lastMessageAt && (
                      <p className="text-xs text-text-secondary shrink-0">
                        {timeAgo(chat.lastMessageAt)}
                      </p>
                    )}
                  </div>

                  {/* Job tag */}
                  {job && (
                    <p className="text-xs text-primary font-medium truncate mt-0.5">
                      {job.title}
                    </p>
                  )}

                  {/* Last message preview */}
                  <p
                    className={cn(
                      "text-xs truncate mt-0.5",
                      unread > 0
                        ? "text-text-primary font-medium"
                        : "text-text-secondary"
                    )}
                  >
                    {chat.lastMessage ?? "Inicia una conversación"}
                  </p>
                </div>
              </Link>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}
