"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ArrowLeft, Send, Info } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { MessageBubble } from "./MessageBubble";
import { useAuth } from "@/context";
import { useChat } from "@/context";
import { useJobs } from "@/context";
import { getUserById } from "@/data/users";
import type { Chat } from "@/types";

interface ChatWindowProps {
  chat: Chat;
}

export function ChatWindow({ chat }: ChatWindowProps) {
  const { user } = useAuth();
  const { getMessagesByChat, sendMessage, markChatRead } = useChat();
  const { getJobById } = useJobs();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const userId = user?.id ?? "";
  const messages = getMessagesByChat(chat.id);
  const otherId = chat.participantIds.find((id) => id !== userId);
  const other = otherId ? getUserById(otherId) : undefined;
  const job = getJobById(chat.jobId);

  // Mark read on open and when new messages arrive
  useEffect(() => {
    markChatRead(chat.id, userId);
  }, [chat.id, userId, markChatRead, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    sendMessage(chat.id, userId, text);
    setInput("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, chat.id, userId, sendMessage]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    // Auto-resize
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }

  return (
    <div className="flex flex-col h-full bg-paper">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-stone-200 shrink-0">
        {/* Back button — mobile only */}
        <Link
          href="/mensajes"
          className="md:hidden -ml-1.5 p-2.5 rounded-xl hover:bg-stone-100 transition-colors shrink-0 min-h-[44px] flex items-center"
          aria-label="Volver a mensajes"
        >
          <ArrowLeft className="w-5 h-5 text-ink" />
        </Link>

        <Avatar name={other?.name ?? "?"} size="md" />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink text-sm truncate">
            {other?.name ?? "Usuario"}
          </p>
          {job && (
            <p className="text-xs text-stone-500 truncate">{job.title}</p>
          )}
        </div>

        {/* Job status pill */}
        {job && (
          <Badge
            variant={
              job.status === "completed"
                ? "success"
                : job.status === "in_progress"
                ? "warning"
                : "default"
            }
            size="sm"
            className="shrink-0 hidden sm:flex"
          >
            {job.status === "completed"
              ? "Completado"
              : job.status === "in_progress"
              ? "En progreso"
              : "Abierto"}
          </Badge>
        )}

        <button
          className="-mr-1 p-2.5 rounded-xl hover:bg-stone-100 transition-colors shrink-0 min-h-[44px]"
          aria-label="Detalles del trabajo"
        >
          <Info className="w-5 h-5 text-stone-500" />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Date header */}
        {messages.length > 0 && (
          <div className="flex justify-center mb-4">
            <span className="text-xs text-stone-500 bg-card border border-stone-200 px-3 py-1 rounded-full">
              Conversación iniciada
            </span>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-14 h-14 bg-card rounded-full border border-stone-200 flex items-center justify-center mb-3">
              <Avatar name={other?.name ?? "?"} size="md" />
            </div>
            <p className="text-sm font-semibold text-ink">
              {other?.name}
            </p>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Sé el primero en escribir. Preséntate y confirma los detalles del trabajo.
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === userId}
              />
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 bg-card border-t border-stone-200 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 bg-paper text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink transition-colors resize-none leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 bg-ink rounded-xl flex items-center justify-center hover:bg-ink/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4 text-paper" />
          </button>
        </div>
        <p className="text-xs text-stone-400 text-center mt-2">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}
