"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context";
import { SkeletonEmployerDashboard } from "@/components/ui/Skeleton";
import { Navbar } from "@/components/layout/Navbar";

export default function EmployerShortcut() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    login("u8");
    router.replace("/dashboard/employer");
  }, [login, router]);

  return (
    <>
      <Navbar />
      <SkeletonEmployerDashboard />
    </>
  );
}
