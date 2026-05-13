"use client";

import { AuthProvider } from "./AuthContext";
import { JobProvider } from "./JobContext";
import { ChatProvider } from "./ChatContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <JobProvider>
        <ChatProvider>{children}</ChatProvider>
      </JobProvider>
    </AuthProvider>
  );
}
