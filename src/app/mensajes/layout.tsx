"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ConversationList } from "@/components/features/chat/ConversationList";
import { cn } from "@/lib/utils";

export default function MensajesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  // /mensajes/[chatId] → ["mensajes", chatId]
  const activeChatId = pathParts.length === 2 ? pathParts[1] : undefined;
  const inChat = !!activeChatId;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-paper">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar — always visible on desktop, hidden in chat on mobile ── */}
        <aside
          className={cn(
            "flex-col border-r border-stone-200 bg-card overflow-hidden",
            "w-full md:w-80 md:flex shrink-0",
            inChat ? "hidden md:flex" : "flex"
          )}
        >
          <ConversationList activeChatId={activeChatId} />
        </aside>

        {/* ── Main content ── */}
        <main
          className={cn(
            "flex-1 flex-col overflow-hidden",
            inChat ? "flex" : "hidden md:flex"
          )}
        >
          {children}
        </main>
      </div>

      {/* BottomNav only on list page (chat takes full focus on mobile) */}
      {!inChat && <BottomNav />}
    </div>
  );
}
