import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getSettings } from "@/lib/portfolio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Admin — Settings" }, { name: "robots", content: "noindex" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  const qc = useQueryClient();
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const [form, setForm] = useState({ site_name: "", tagline: "", footer_text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        site_name: settings.site_name,
        tagline: settings.tagline,
        footer_text: settings.footer_text,
      });
    }
  }, [settings]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from("site_settings").update(form).eq("id", settings.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved.");
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Site-wide text and branding.</p>

      <div className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="site_name">Site name</Label>
          <Input
            id="site_name"
            value={form.site_name}
            onChange={(e) => setForm({ ...form, site_name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="footer_text">Footer text</Label>
          <Input
            id="footer_text"
            value={form.footer_text}
            onChange={(e) => setForm({ ...form, footer_text: e.target.value })}
          />
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save settings
        </button>
      </div>
    </div>
  );
}
