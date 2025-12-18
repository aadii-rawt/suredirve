"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, initialized } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !user) {
      router.replace("/login");
    }
  }, [initialized, user, router]);

  // ⏳ Wait until auth state is restored
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // 🚫 Initialized but no user → redirecting
  if (!user) return null;

  return <>{children}</>;
}
