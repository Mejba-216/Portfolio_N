import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  User,
  FileText,
  FolderKanban,
  Award,
  Mail,
  Settings,
  LogOut,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Profile", to: "/admin/profile", icon: User },
  { label: "Resume", to: "/admin/resume", icon: FileText },
  { label: "Projects", to: "/admin/projects", icon: FolderKanban },
  { label: "Achievements", to: "/admin/achievements", icon: Award },
  { label: "Messages", to: "/admin/messages", icon: Mail },
  { label: "Settings", to: "/admin/settings", icon: Settings },
] as const;

function AdminLayout() {
  const state = useAdmin();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (state.status === "signed-out" || state.status === "not-admin") {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [state.status, navigate]);

  if (pathname === "/admin/login") return <Outlet />;

  if (state.status !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-border bg-card lg:flex">
        <div className="border-b border-border px-5 py-5">
          <span className="font-display text-sm font-extrabold tracking-tight">Admin Panel</span>
          <span className="block truncate text-xs text-muted-foreground">{state.email}</span>
        </div>
        <nav className="flex-1 py-3" aria-label="Admin navigation">
          {ADMIN_NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "border-r-2 border-gold bg-muted text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile admin nav */}
      <div className="sticky top-0 z-40 flex items-center gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden">
        {ADMIN_NAV.map((item) => {
          const active = pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground",
                active && "bg-muted text-foreground",
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={logout}
          className="ml-auto flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </div>

      <main className="lg:pl-56">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
