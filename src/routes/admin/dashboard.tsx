import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Award, Mail, MailOpen, FileBadge, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

async function count(table: string): Promise<number> {
  const { count: c } = await supabase
    .from(table as any)
    .select("*", { count: "exact", head: true });
  return c ?? 0;
}

async function getStats() {
  const [projects, achievements, certs, messages, unread] = await Promise.all([
    count("projects"),
    count("achievements"),
    count("certifications"),
    count("messages"),
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("read", false)
      .then((r) => r.count ?? 0),
  ]);
  return { projects, achievements, certs, messages, unread };
}

function AdminDashboard() {
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: getStats });

  const cards = [
    { label: "Total Projects", value: data?.projects, icon: FolderKanban, to: "/admin/projects" },
    { label: "Achievements", value: data?.achievements, icon: Award, to: "/admin/achievements" },
    { label: "Certifications", value: data?.certs, icon: FileBadge, to: "/admin/resume" },
    { label: "Messages", value: data?.messages, icon: MailOpen, to: "/admin/messages" },
    { label: "Unread Messages", value: data?.unread, icon: Mail, to: "/admin/messages" },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of your portfolio content.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{c.label}</span>
              <c.icon className="h-5 w-5 text-gold" />
            </div>
            <p className="mt-3 font-display text-3xl font-extrabold">{c.value ?? "—"}</p>
          </Link>
        ))}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Last checked</span>
            <Clock className="h-5 w-5 text-gold" />
          </div>
          <p className="mt-3 font-display text-lg font-bold">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}
