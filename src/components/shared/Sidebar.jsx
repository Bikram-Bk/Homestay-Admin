"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Homestays",
    href: "/homestays",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "Village Guides",
    href: "/village-guides",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    label: "Travelers",
    href: "/users",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: "Reviews",
    href: "/reviews",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

export default function Sidebar({ collapsed = false, onToggle }) {
  const pathname = usePathname();
  const { currentUser, logout, isLoggingOut } = useAdminAuth();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`bg-admin-sidebar border-r border-white/10 flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"
        }`}
    >
      {/* ── Floating Toggle Button (sidebar ko right edge ma) ── */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3.5 top-[76px] w-7 h-7 rounded-full bg-admin-card border border-admin-border text-admin-muted hover:text-teal hover:border-teal/50 flex items-center justify-center shadow-md transition-colors z-40 cursor-pointer"
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Brand Header */}
      <div
        className={`h-16 flex items-center gap-3 border-b border-white/10 ${collapsed ? "justify-center px-0" : "px-6"
          }`}
      >
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-bold text-sm tracking-wide text-sidebar-text whitespace-nowrap">Homestay Nepal</span>
            <span className="block text-[10px] font-semibold text-gold tracking-widest uppercase">Admin</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${collapsed ? "justify-center px-0 py-2.5" : "px-3.5 py-2.5"
                } ${active
                  ? "bg-sidebar-active text-sidebar-text border border-white/10 shadow-sm"
                  : "text-sidebar-muted hover:text-sidebar-text hover:bg-white/[0.06]"
                }`}
            >
              <span className={`flex-shrink-0 ${active ? "text-sidebar-text" : "text-sidebar-muted"}`}>
                {item.icon}
              </span>
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Admin User / Logout */}
      <div className="p-3 border-t border-white/10">
        {collapsed ? (
          /* Collapsed: avatar + logout stacked */
          <div className="flex flex-col items-center gap-2 py-1">
            <div
              className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 text-gold flex items-center justify-center font-bold text-xs flex-shrink-0"
              title={currentUser?.name || "Administrator"}
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              title="Sign out"
              className="p-1.5 text-sidebar-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          /* Expanded: full user card */
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.05]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 text-gold flex items-center justify-center font-bold text-xs flex-shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-sidebar-text truncate">
                  {currentUser?.name || "Administrator"}
                </p>
                <p className="text-[10px] text-sidebar-muted truncate">
                  {currentUser?.email || "admin@portal"}
                </p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              title="Sign out"
              className="p-1.5 text-sidebar-muted hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
