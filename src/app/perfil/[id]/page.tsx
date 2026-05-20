"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { WorkerProfileView } from "@/components/features/profile/WorkerProfileView";
import { EmployerProfileView } from "@/components/features/profile/EmployerProfileView";
import { api } from "@/lib/api";
import type { User } from "@/types";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    api.get<User>(`/users/${id}`)
      .then(setUser)
      .catch(() => setUser(null));
  }, [id]);

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Navbar />

      <div className="bg-paper/95 border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <Link
            href="/explorar"
            className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-ink transition-colors"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            Explorar trabajadores
          </Link>
        </div>
      </div>

      {user === undefined ? (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-sm text-stone-400">Cargando perfil…</p>
        </div>
      ) : !user ? (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-lg font-bold text-ink">Perfil no encontrado</p>
          <p className="text-sm text-stone-400 mt-1">El usuario que buscas no existe.</p>
          <Link href="/explorar" className="inline-block mt-4 text-sm text-ink font-semibold underline underline-offset-2">
            Ver trabajadores
          </Link>
        </div>
      ) : user.role === "worker" ? (
        <WorkerProfileView user={user} />
      ) : (
        <EmployerProfileView user={user} />
      )}

      <BottomNav />
    </div>
  );
}
