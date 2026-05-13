"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { WorkerProfileView } from "@/components/features/profile/WorkerProfileView";
import { EmployerProfileView } from "@/components/features/profile/EmployerProfileView";
import { getUserById } from "@/data/users";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const user = getUserById(id);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      {/* Back nav */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>
      </div>

      {!user ? (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-lg font-semibold text-text-primary">
            Perfil no encontrado
          </p>
          <p className="text-sm text-text-secondary mt-1">
            El usuario que buscas no existe o fue eliminado.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm text-primary font-medium hover:underline"
          >
            Volver al inicio
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
