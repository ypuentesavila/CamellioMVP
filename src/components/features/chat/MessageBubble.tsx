import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  // System / offer update messages — centered pill
  if (message.type === "system" || message.type === "offer_update") {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs text-stone-500 bg-paper border border-stone-200 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-end gap-2 mb-1",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex flex-col max-w-[75%] sm:max-w-[65%]",
          isOwn ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "px-4 py-2.5 text-sm leading-relaxed break-words",
            isOwn
              ? "bg-ink text-paper rounded-2xl rounded-br-sm"
              : "bg-card border border-stone-200 text-ink rounded-2xl rounded-bl-sm shadow-card"
          )}
        >
          {message.content}
        </div>
        <p className="text-xs text-stone-400 mt-1 px-1">
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
