import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getProfile, getSocialLinks, type SocialLink } from "@/lib/portfolio";
import { uploadFile, deleteFile } from "@/lib/storage";
import { SignedImage } from "@/components/SignedImage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Admin — Profile" }, { name: "robots", content: "noindex" }] }),
  component: AdminProfile,
});

function AdminProfile() {
  const qc = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: socials } = useQuery({ queryKey: ["social-links"], queryFn: getSocialLinks });
  const [form, setForm] = useState({
    full_name: "", title: "", bio: "", summary: "", location: "", email: "", phone: "",
  });
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name, title: profile.title, bio: profile.bio,
        summary: profile.summary, location: profile.location, email: profile.email,
        phone: profile.phone,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (socials) setLinks(socials);
  }, [socials]);

  async function save() {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from("profile").update(form).eq("id", profile.id);
    if (error) {
      setSaving(false);
      toast.error(error.message);
      return;
    }
    // Save social links
    for (const link of links) {
      await supabase.from("social_links").update({ platform: link.platform, url: link.url }).eq("id", link.id);
    }
    setSaving(false);
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.invalidateQueries({ queryKey: ["social-links"] });
    toast.success("Profile saved.");
  }

  async function uploadPhoto(file: File) {
    if (!profile) return;
    setUploading(true);
    try {
      const ref = await uploadFile("profile-images", file);
      if (profile.photo_url) await deleteFile(profile.photo_url).catch(() => {});
      const { error } = await supabase.from("profile").update({ photo_url: ref }).eq("id", profile.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Photo updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    }
    setUploading(false);
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your public identity on the portfolio.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <div>
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            <SignedImage
              fileRef={profile?.photo_url}
              alt="Profile photo"
              className="aspect-square w-full object-cover"
              fallback={<div className="flex aspect-square items-center justify-center text-muted-foreground text-sm">No photo</div>}
            />
          </div>
          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
            />
          </label>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" value={form.full_name} onChange={set("full_name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={set("title")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio (short, shown on home)</Label>
            <Textarea id="bio" rows={3} value={form.bio} onChange={set("bio")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="summary">Summary (longer, shown on resume)</Label>
            <Textarea id="summary" rows={5} value={form.summary} onChange={set("summary")} />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={set("email")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={set("location")} />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="font-display text-sm font-bold">Social links</h2>
            {links.map((link, i) => (
              <div key={link.id} className="grid gap-3 sm:grid-cols-[160px_1fr]">
                <Input
                  value={link.platform}
                  onChange={(e) => {
                    const next = [...links];
                    next[i] = { ...link, platform: e.target.value };
                    setLinks(next);
                  }}
                  aria-label="Platform"
                />
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const next = [...links];
                    next[i] = { ...link, url: e.target.value };
                    setLinks(next);
                  }}
                  aria-label="URL"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
