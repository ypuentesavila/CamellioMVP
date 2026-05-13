"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context";
import { SkeletonWorkerDashboard } from "@/components/ui/Skeleton";
import { Navbar } from "@/components/layout/Navbar";

export default function WorkerShortcut() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    login("u1");
    router.replace("/dashboard/worker");
  }, [login, router]);

  return (
    <>
      <Navbar />
      <SkeletonWorkerDashboard />
    </>
  );
}
