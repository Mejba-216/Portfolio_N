import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2, Upload, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getProjects, slugify, type Project } from "@/lib/portfolio";
import { uploadFile, deleteFile } from "@/lib/storage";
import { SignedImage } from "@/components/SignedImage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Admin — Projects" }, { name: "robots", content: "noindex" }] }),
  component: AdminProjects,
});

const EMPTY = {
  title: "", slug: "", short_description: "", description: "",
  features: "", technologies: "", github_url: "", live_url: "",
  year: "", featured: false, published: true,
};

function AdminProjects() {
  const qc = useQueryClient();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => getProjects(false),
  });
  const [editing, setEditing] = useState<Project | null>(null);
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

  function startEdit(p: Project) {
    setForm({
      title: p.title, slug: p.slug, short_description: p.short_description,
      description: p.description, features: p.features.join("\n"),
      technologies: p.technologies.join(", "), github_url: p.github_url,
      live_url: p.live_url, year: p.year?.toString() ?? "",
      featured: p.featured, published: p.published,
    });
    setEditing(p);
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
      slug: form.slug.trim() || slugify(form.title),
      short_description: form.short_description,
      description: form.description,
      features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
      technologies: form.technologies.split(",").map((s) => s.trim()).filter(Boolean),
      github_url: form.github_url,
      live_url: form.live_url,
      year: form.year ? parseInt(form.year, 10) : null,
      featured: form.featured,
      published: form.published,
    };
    const { error } = editing
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Project updated." : "Project created.");
    qc.invalidateQueries({ queryKey: ["admin-projects"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
    close();
  }

  async function remove(p: Project) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else {
      if (p.cover_image_url) await deleteFile(p.cover_image_url).catch(() => {});
      toast.success("Project deleted.");
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    }
  }

  async function uploadCover(p: Project, file: File) {
    setUploading(true);
    try {
      const ref = await uploadFile("project-images", file);
      if (p.cover_image_url) await deleteFile(p.cover_image_url).catch(() => {});
      const { error } = await supabase.from("projects").update({ cover_image_url: ref }).eq("id", p.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Cover image updated.");
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
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the projects shown on your portfolio.</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      {isLoading ? (
        <div className="mt-8 space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
      ) : !projects?.length ? (
        <p className="mt-10 text-sm text-muted-foreground">No projects yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {projects.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                <SignedImage fileRef={p.cover_image_url} alt={p.title} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{p.title}</span>
                  {p.featured && <Star className="h-3.5 w-3.5 fill-gold text-gold" />}
                  <Badge variant={p.published ? "secondary" : "outline"} className="text-[11px]">
                    {p.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{p.short_description}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  Cover
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadCover(p, e.target.files[0])}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(p)}
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
          <DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle>
          <div className="mt-2 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="p-title">Title</Label>
                <Input id="p-title" value={form.title} onChange={set("title")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-slug">Slug (URL)</Label>
                <Input id="p-slug" value={form.slug} onChange={set("slug")} placeholder="auto-generated from title" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-short">Short description</Label>
              <Input id="p-short" value={form.short_description} onChange={set("short_description")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-desc">Full description</Label>
              <Textarea id="p-desc" rows={4} value={form.description} onChange={set("description")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-features">Key features (one per line)</Label>
              <Textarea id="p-features" rows={4} value={form.features} onChange={set("features")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-tech">Technologies (comma separated)</Label>
              <Input id="p-tech" value={form.technologies} onChange={set("technologies")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-gh">GitHub URL</Label>
                <Input id="p-gh" value={form.github_url} onChange={set("github_url")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-live">Live URL</Label>
                <Input id="p-live" value={form.live_url} onChange={set("live_url")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-year">Year</Label>
                <Input id="p-year" type="number" value={form.year} onChange={set("year")} />
              </div>
            </div>
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
                Published
              </label>
            </div>
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
