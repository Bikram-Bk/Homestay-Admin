"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/shared/Sidebar";
import { useAdminStore } from "@/store/adminStore";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAdminStore();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    hydrate();
    setMounted(true);
    const saved = localStorage.getItem("hn_admin_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
  }, [hydrate]);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/login");
    }
  }, [mounted, isAuthenticated, router]);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("hn_admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-admin-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-admin-muted text-sm">
          <svg className="animate-spin h-7 w-7 text-gold" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading admin workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-admin-bg flex">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <main
        className={`flex-1 min-h-screen p-8 overflow-y-auto transition-all duration-300 ${
          collapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
