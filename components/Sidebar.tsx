"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Dumbbell,
  Heart,
  Briefcase,
  ScanLine,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  LogOut,
  LifeBuoy,
  CreditCard,
} from "lucide-react";
import { useUser } from "@/lib/userContext";

const navItems = [
  { href: "/",             label: "Dashboard",       icon: LayoutDashboard, section: "main" },
  { href: "/pricing",      label: "Pricing Plans",   icon: CreditCard,      section: "main" },
  { href: "/fitness",      label: "Fitness & Health", icon: Dumbbell,        section: "planners", badge: "AI"  },
  { href: "/pregnancy",    label: "Women's Health",   icon: Heart,           section: "planners", badge: "AI"  },
  { href: "/business",     label: "Business Planner", icon: Briefcase,       section: "planners", badge: "AI"  },
  { href: "/food-scanner", label: "AI Food Scanner",  icon: ScanLine,        section: "tools",    badge: "NEW" },
  { href: "/support",      label: "Support & Help",   icon: LifeBuoy,        section: "support" },
];

const sections = ["main", "planners", "tools", "support"];
const sectionLabels: Record<string, string> = {
  main: "Overview",
  planners: "AI Planners",
  tools: "Smart Tools",
  support: "Help",
};



export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const firstName = user?.firstName ?? "";
  const plan      = user?.plan      ?? "";
  const initials  = firstName ? firstName.charAt(0).toUpperCase() : "G";

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Sparkles size={20} color="white" />
        </div>
        <div>
          <div className="logo-text">PlannerHub</div>
          <div className="logo-sub">AI-Powered Platform</div>
        </div>
        {/* Close button — mobile only */}
        <button
          className="sidebar-close-btn"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sections.map((section) => {
          const items = navItems.filter((item) => item.section === section);
          return (
            <div key={section}>
              <div className="nav-section-label">{sectionLabels[section]}</div>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${isActive ? "active" : ""}`}
                  >
                    <Icon className="nav-icon" size={18} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer — dynamic user */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{firstName || "Guest"}</div>
            <div className="user-plan">✦ {plan || "Free Plan"}</div>
          </div>
          <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "0.625rem",
            width: "100%", padding: "0.625rem 0.875rem",
            marginTop: "0.5rem", borderRadius: 10, border: "none",
            background: "rgba(244,63,94,0.07)",
            color: "var(--accent-rose)", fontSize: "0.8rem",
            fontWeight: 600, cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244,63,94,0.14)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(244,63,94,0.07)")}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile Top Header ─────────────────────────────── */}
      <header className="mobile-header">
        <button
          className="hamburger-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          id="hamburger-btn"
        >
          <Menu size={22} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div className="logo-icon" style={{ width: 30, height: 30, borderRadius: 9 }}>
            <Sparkles size={15} color="white" />
          </div>
          <span className="logo-text" style={{ fontSize: "1rem" }}>PlannerHub</span>
        </div>

        <div className="user-avatar" style={{ width: 32, height: 32, fontSize: "0.75rem" }}>
          {initials}
        </div>
      </header>

      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <aside className="sidebar desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* ── Mobile Backdrop ───────────────────────────────── */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? "visible" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ─────────────────────────────────── */}
      <aside className={`sidebar mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
