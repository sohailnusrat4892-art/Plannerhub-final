"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/lib/userContext";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useUser();
  const pathname = usePathname();
  const router   = useRouter();

  const isAuthRoute = pathname.startsWith("/auth");

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !isAuthRoute) {
      router.replace("/auth/login");
    }

    if (isAuthenticated && isAuthRoute) {
      router.replace("/");
    }
  }, [isAuthenticated, isAuthRoute, isLoading, router]);

  /* ── Show nothing while hydrating session from localStorage ── */
  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "1rem",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          border: "3px solid rgba(0,212,255,0.15)",
          borderTopColor: "var(--accent-cyan)",
          animation: "spin 0.8s linear infinite",
        }} />
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
          Loading PlannerHub…
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Auth pages: full-screen, no sidebar ── */
  if (isAuthRoute) {
    return <>{children}</>;
  }

  /* ── Guard: unauthenticated trying to access app ── */
  if (!isAuthenticated) {
    return null;
  }

  /* ── Authenticated app shell ── */
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}
