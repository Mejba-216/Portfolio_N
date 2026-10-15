import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getProfile } from "@/lib/portfolio";
import { uploadFile, deleteFile, useSignedUrl } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/resume")({
  head: () => ({ meta: [{ title: "Admin — Resume" }, { name: "robots", content: "noindex" }] }),
  component: AdminResume,
});

// ---------- Generic section editor ----------

type FieldType = "text" | "textarea" | "date" | "number";
interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  grid?: boolean; // render half-width
}
interface SectionDef {
  table: string;
  title: string;
  fields: FieldDef[];
  rowLabel: (row: any) => string;
  rowSub?: (row: any) => string;
}

const SECTIONS: SectionDef[] = [
  {
    table: "experience",
    title: "Experience",
    fields: [
      { key: "position", label: "Position", type: "text", grid: true },
      { key: "company", label: "Company", type: "text", grid: true },
      { key: "location", label: "Location", type: "text", grid: true },
      { key: "start_date", label: "Start date", type: "date", grid: true },
      { key: "end_date", label: "End date (empty = present)", type: "date", grid: true },
      { key: "technologies", label: "Technologies (comma separated)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
    rowLabel: (r) => r.position,
    rowSub: (r) => r.company,
  },
  {
    table: "education",
    title: "Education",
    fields: [
      { key: "degree", label: "Degree", type: "text", grid: true },
      { key: "institution", label: "Institution", type: "text", grid: true },
      { key: "location", label: "Location", type: "text", grid: true },
      { key: "start_date", label: "Start date", type: "date", grid: true },
      { key: "end_date", label: "End date", type: "date", grid: true },
      { key: "description", label: "Description", type: "textarea" },
    ],
    rowLabel: (r) => r.degree,
    rowSub: (r) => r.institution,
  },
  {
    table: "skills",
    title: "Skills",
    fields: [
      { key: "name", label: "Skill", type: "text", grid: true },
      { key: "category", label: "Category", type: "text", grid: true, placeholder: "Frontend, Backend…" },
      { key: "level", label: "Level (1–100)", type: "number", grid: true },
    ],
    rowLabel: (r) => r.name,
    rowSub: (r) => r.category,
  },
  {
    table: "certifications",
    title: "Certifications",
    fields: [
      { key: "name", label: "Name", type: "text", grid: true },
      { key: "organization", label: "Organization", type: "text", grid: true },
      { key: "issue_date", label: "Issue date", type: "date", grid: true },
      { key: "credential_id", label: "Credential ID", type: "text", grid: true },
      { key: "credential_url", label: "Credential URL", type: "text" },
    ],
    rowLabel: (r) => r.name,
    rowSub: (r) => r.organization,
  },
  {
    table: "languages",
    title: "Languages",
    fields: [
      { key: "language", label: "Language", type: "text", grid: true },
      { key: "level", label: "Level", type: "text", grid: true, placeholder: "Native, Fluent…" },
    ],
    rowLabel: (r) => r.language,
    rowSub: (r) => r.level,
  },
  {
    table: "awards",
    title: "Awards",
    fields: [
      { key: "title", label: "Title", type: "text", grid: true },
      { key: "organization", label: "Organization", type: "text", grid: true },
      { key: "award_date", label: "Date", type: "date", grid: true },
      { key: "description", label: "Description", type: "textarea" },
    ],
    rowLabel: (r) => r.title,
    rowSub: (r) => r.organization,
  },
];

function SectionEditor({ def }: { def: SectionDef }) {
  const qc = useQueryClient();
  const queryKey = ["admin-section", def.table];
  const { data: rows, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(def.table as any)
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const open = creating || !!editing;

  function startCreate() {
    const empty: Record<string, string> = {};
    for (const f of def.fields) empty[f.key] = "";
    setForm(empty);
    setEditing(null);
    setCreating(true);
  }

  function startEdit(row: any) {
    const values: Record<string, string> = {};
    for (const f of def.fields) {
      const v = row[f.key];
      values[f.key] = Array.isArray(v) ? v.join(", ") : v == null ? "" : String(v);
    }
    setForm(values);
    setEditing(row);
    setCreating(false);
  }

  function close() {
    setEditing(null);
    setCreating(false);
  }

  async function save() {
    setSaving(true);
    const payload: Record<string, any> = {};
    for (const f of def.fields) {
      const raw = form[f.key]?.trim() ?? "";
      if (f.type === "date") payload[f.key] = raw || null;
      else if (f.type === "number") payload[f.key] = raw ? parseInt(raw, 10) : 0;
      else if (f.key === "technologies") payload[f.key] = raw.split(",").map((s) => s.trim()).filter(Boolean);
      else payload[f.key] = raw;
    }
    const { error } = editing
      ? await supabase.from(def.table as any).update(payload).eq("id", editing.id)
      : await supabase.from(def.table as any).insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved.");
    qc.invalidateQueries({ queryKey });
    close();
  }

  async function remove(row: any) {
    if (!confirm(`Delete "${def.rowLabel(row)}"?`)) return;
    const { error } = await supabase.from(def.table as any).delete().eq("id", row.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted.");
      qc.invalidateQueries({ queryKey });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">{def.title}</h2>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {isLoading ? (
        <Skeleton className="mt-4 h-14 w-full" />
      ) : !rows?.length ? (
        <p className="mt-4 text-sm text-muted-foreground">Nothing added yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{def.rowLabel(row)}</p>
                {def.rowSub && <p className="truncate text-xs text-muted-foreground">{def.rowSub(row)}</p>}
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => startEdit(row)}
                  className="rounded-md border border-border p-1.5 hover:bg-muted"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(row)}
                  className="rounded-md border border-border p-1.5 text-destructive hover:bg-muted"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto" aria-describedby={undefined}>
          <DialogTitle>{editing ? `Edit ${def.title.slice(0, -1)}` : `Add to ${def.title}`}</DialogTitle>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {def.fields.map((f) => (
              <div key={f.key} className={f.grid ? "space-y-1.5" : "space-y-1.5 sm:col-span-2"}>
                <Label htmlFor={`${def.table}-${f.key}`}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={`${def.table}-${f.key}`}
                    rows={3}
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                ) : (
                  <Input
                    id={`${def.table}-${f.key}`}
                    type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
                    placeholder={f.placeholder}
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
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
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ---------- Resume file + sections ----------

function ResumeFileCard() {
  const qc = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const signed = useSignedUrl(profile?.resume_url);
  const [uploading, setUploading] = useState(false);

  async function uploadResume(file: File) {
    if (!profile) return;
    setUploading(true);
    try {
      const ref = await uploadFile("resume-files", file);
      if (profile.resume_url) await deleteFile(profile.resume_url).catch(() => {});
      const { error } = await supabase.from("profile").update({ resume_url: ref }).eq("id", profile.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Resume file updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    }
    setUploading(false);
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-bold">Resume file (PDF)</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The downloadable resume linked from the Resume page.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {profile?.resume_url && signed.data ? (
          <a
            href={signed.data}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            <FileText className="h-4 w-4" /> View current resume
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">No resume uploaded yet.</span>
        )}
        <label className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload PDF
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadResume(e.target.files[0])}
          />
        </label>
      </div>
    </section>
  );
}

function AdminResume() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight">Resume</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the resume file and every section of your resume page.
      </p>
      <div className="mt-8 space-y-6">
        <ResumeFileCard />
        {SECTIONS.map((def) => (
          <SectionEditor key={def.table} def={def} />
        ))}
      </div>
    </div>
  );
}
