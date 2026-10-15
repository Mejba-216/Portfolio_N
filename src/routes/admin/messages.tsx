import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MailOpen, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getMessages } from "@/lib/portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Admin — Messages" }, { name: "robots", content: "noindex" }] }),
  component: AdminMessages,
});

function AdminMessages() {
  const qc = useQueryClient();
  const { data: messages, isLoading } = useQuery({ queryKey: ["messages"], queryFn: getMessages });

  async function toggleRead(id: string, read: boolean) {
    await supabase.from("messages").update({ read: !read }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["messages"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  async function remove(id: string) {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Message deleted.");
      qc.invalidateQueries({ queryKey: ["messages"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Messages sent through the contact form.</p>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : !messages?.length ? (
        <p className="mt-10 text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "rounded-xl border border-border bg-card p-5",
                !m.read && "border-l-4 border-l-gold",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-sm text-muted-foreground hover:underline">
                    {m.email}
                  </a>
                  {!m.read && <Badge className="bg-gold text-[11px] text-accent-foreground">New</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              {m.subject && <p className="mt-2 text-sm font-semibold">{m.subject}</p>}
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{m.message}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleRead(m.id, m.read)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                >
                  {m.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                  Mark as {m.read ? "unread" : "read"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-muted"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
