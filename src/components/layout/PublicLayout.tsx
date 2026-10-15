import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, Github, Linkedin, Twitter, Globe, Mail } from "lucide-react";
import { getProfile, getSettings, getSocialLinks } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Resume", to: "/resume" },
  { label: "Projects", to: "/projects" },
  { label: "Poster Designs", to: "/designs" },
  { label: "Achievement", to: "/achievements" },
  { label: "Contact", to: "/contact" },
] as const;

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  const cls = "h-4 w-4";
  if (p.includes("github")) return <Github className={cls} />;
  if (p.includes("linkedin")) return <Linkedin className={cls} />;
  if (p.includes("twitter") || p.includes("x")) return <Twitter className={cls} />;
  if (p.includes("mail") || p.includes("email")) return <Mail className={cls} />;
  return <Globe className={cls} />;
}

function SocialLinks() {
  const { data: links } = useQuery({ queryKey: ["social-links"], queryFn: getSocialLinks });
  if (!links?.length) return null;
  return (
    <div className="flex items-center gap-4">
      {links.map((l) => (
        <a
          key={l.id}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          aria-label={l.platform}
          className="text-sidebar-muted transition-colors hover:text-sidebar-foreground"
        >
          <SocialIcon platform={l.platform} />
        </a>
      ))}
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings });

  return (
    <div className="flex h-full flex-col">
      <div className="px-7 pt-10 pb-8">
        <Link to="/" onClick={onNavigate} className="block">
          <span className="font-display text-lg font-extrabold tracking-tight text-sidebar-foreground">
            {profile?.full_name ?? settings?.site_name ?? "Portfolio"}
          </span>
          <span className="mt-1 block text-xs text-sidebar-muted">
            {profile?.title ?? settings?.tagline ?? ""}
          </span>
        </Link>
      </div>

      <nav aria-label="Main navigation" className="mt-2 flex-1">
        <ul>
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn("sidebar-link", active && "sidebar-link-active")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border px-7 py-6">
        <SocialLinks />
        <p className="mt-4 text-[11px] leading-relaxed text-sidebar-muted">
          {settings?.footer_text ?? ""}
        </p>
      </div>
    </div>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 bg-sidebar lg:block">
        <SidebarNav />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur lg:hidden">
        <Link to="/" className="font-display text-base font-extrabold tracking-tight">
          {profile?.full_name ?? "Portfolio"}
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-sidebar shadow-xl">
            <div className="flex justify-end p-3">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-sidebar-muted hover:text-sidebar-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-60">
        <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 lg:py-14">{children}</div>
      </main>
    </div>
  );
}
