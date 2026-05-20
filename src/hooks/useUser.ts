import { useState, useEffect } from "react";
import type { User } from "@/types";
import { api } from "@/lib/api";

// Module-level cache — survives re-renders, shared across components
const userCache: Record<string, User> = {};

export function useUser(id: string | null | undefined): User | null {
  const [user, setUser] = useState<User | null>(
    id ? (userCache[id] ?? null) : null
  );

  useEffect(() => {
    if (!id) return;
    if (userCache[id]) {
      setUser(userCache[id]);
      return;
    }
    api
      .get<User>(`/users/${id}`)
      .then((u) => {
        userCache[id] = u;
        setUser(u);
      })
      .catch(() => {});
  }, [id]);

  return user;
}
