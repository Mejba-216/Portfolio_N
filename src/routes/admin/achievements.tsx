import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2, Upload, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getAchievements, formatDate, type Achievement } from "@/lib/portfolio";
import { uploadFile, deleteFile } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/achievements")({
  head: () => ({ meta: [{ title: "Admin — Achievements" }, { name: "robots", content: "noindex" }] }),
  component: AdminAchievements,
});

const EMPTY = {
  title: "", organization: "", category: "Award", achievement_date: "",
  description: "", credential_id: "", credential_url: "", featured: false,
};

function AdminAchievements() {
  const qc = useQueryClient();
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
  });
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const open = creating || !!editing;

  function startCreate() {
    setForm(EMPTY);
    setEditing(null);
    setCreating(true);
  }

  function startEdit(a: Achievement) {
    setForm({
      title: a.title, organization: a.organization, category: a.category,
      achievement_date: a.achievement_date ?? "", description: a.description,
      credential_id: a.credential_id, credential_url: a.credential_url, featured: a.featured,
    });
    setEditing(a);
    setCreating(false);
  }

  function close() {
    setEditing(null);
    setCreating(false);
  }

  async function save() {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      organization: form.organization,
      category: form.category,
      achievement_date: form.achievement_date || null,
      description: form.description,
      credential_id: form.credential_id,
      credential_url: form.credential_url,
      featured: form.featured,
    };
    const { error } = editing
      ? await supabase.from("achievements").update(payload).eq("id", editing.id)
      : await supabase.from("achievements").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Achievement updated." : "Achievement created.");
    qc.invalidateQueries({ queryKey: ["achievements"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
    close();
  }

  async function remove(a: Achievement) {
    if (!confirm(`Delete "${a.title}"?`)) return;
    const { error } = await supabase.from("achievements").delete().eq("id", a.id);
    if (error) toast.error(error.message);
    else {
      if (a.certificate_url) await deleteFile(a.certificate_url).catch(() => {});
      toast.success("Achievement deleted.");
      qc.invalidateQueries({ queryKey: ["achievements"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    }
  }

  async function uploadCert(a: Achievement, file: File) {
    setUploading(true);
    try {
      const ref = await uploadFile("achievement-certificates", file);
      if (a.certificate_url) await deleteFile(a.certificate_url).catch(() => {});
      const { error } = await supabase
        .from("achievements")
        .update({ certificate_url: ref, certificate_type: file.type })
        .eq("id", a.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Certificate uploaded.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    }
    setUploading(false);
  }

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Achievements</h1>
          <p className="mt-1 text-sm text-muted-foreground">Awards, certifications and certificates.</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New achievement
        </button>
      </div>

      {isLoading ? (
        <div className="mt-8 space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>
      ) : !achievements?.length ? (
        <p className="mt-10 text-sm text-muted-foreground">No achievements yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {achievements.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{a.title}</span>
                  {a.featured && <Star className="h-3.5 w-3.5 fill-gold text-gold" />}
                  <Badge variant="secondary" className="text-[11px]">{a.category}</Badge>
                  {a.certificate_url && <Badge variant="outline" className="text-[11px]">Certificate</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {a.organization}
                  {a.achievement_date ? ` · ${formatDate(a.achievement_date)}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  Certificate
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadCert(a, e.target.files[0])}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => startEdit(a)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(a)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-muted"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" aria-describedby={undefined}>
          <DialogTitle>{editing ? "Edit achievement" : "New achievement"}</DialogTitle>
          <div className="mt-2 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="a-title">Title</Label>
                <Input id="a-title" value={form.title} onChange={set("title")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-org">Organization</Label>
                <Input id="a-org" value={form.organization} onChange={set("organization")} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="a-cat">Category</Label>
                <Input id="a-cat" value={form.category} onChange={set("category")} placeholder="Award, Certification…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-date">Date</Label>
                <Input id="a-date" type="date" value={form.achievement_date} onChange={set("achievement_date")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-desc">Description</Label>
              <Textarea id="a-desc" rows={3} value={form.description} onChange={set("description")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="a-cid">Credential ID</Label>
                <Input id="a-cid" value={form.credential_id} onChange={set("credential_id")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="a-curl">Credential URL</Label>
                <Input id="a-curl" value={form.credential_url} onChange={set("credential_url")} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
              Featured
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={close} className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
