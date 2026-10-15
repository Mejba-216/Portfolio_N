import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { getProfile, getSocialLinks } from "@/lib/portfolio";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Md. Nahid Niaz Nayan" },
      { name: "description", content: "Get in touch with Md. Nahid Niaz Nayan." },
      { property: "og:title", content: "Contact — Md. Nahid Niaz Nayan" },
      { property: "og:description", content: "Get in touch with Md. Nahid Niaz Nayan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(10, "Message should be at least 10 characters.").max(5000),
});

function ContactPage() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: socials } = useQuery({ queryKey: ["social-links"], queryFn: getSocialLinks });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const reduceMotion = useReducedMotion();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);

    const hasSupabase =
      Boolean(import.meta.env.VITE_SUPABASE_URL) || Boolean(process.env.SUPABASE_URL);

    if (!hasSupabase) {
      const targetEmail = profile?.email || "nahid.niaz.nayan@g.bracu.ac.bd";
      const subject = parsed.data.subject || `Message from ${parsed.data.name}`;
      const body = `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`;
      window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      toast.info("Opening your email client to send your message directly.");
      setSending(false);
      return;
    }

    const { error } = await supabase.from("messages").insert(parsed.data);
    setSending(false);
    if (error) {
      toast.error("Could not send your message. Please try again.");
      return;
    }
    toast.success("Message sent successfully. Thank you!");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  const field = (
    id: keyof typeof form,
    label: string,
    el: React.ReactNode,
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {el}
      {errors[id] && <p className="text-xs text-destructive">{errors[id]}</p>}
    </div>
  );

  return (
    <PublicLayout>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-title">Get in touch</p>
        <h1 className="mt-2 page-heading">Contact</h1>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-5">
            <p className="leading-relaxed text-muted-foreground">
              Have a project in mind or just want to say hello? Send a message and I'll get back to
              you.
            </p>
            <ul className="space-y-3 text-sm">
              {profile?.email && (
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="h-4 w-4 text-gold" /> {profile.email}
                  </a>
                </li>
              )}
              {profile?.location && (
                <li className="inline-flex items-center gap-2.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-gold" /> {profile.location}
                </li>
              )}
              {profile?.phone && (
                <li className="inline-flex items-center gap-2.5 text-muted-foreground">
                  <Phone className="h-4 w-4 text-gold" /> {profile.phone}
                </li>
              )}
            </ul>
            {!!socials?.length && (
              <div className="flex flex-wrap gap-2 pt-2">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {field(
                "name",
                "Name",
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  autoComplete="name"
                />,
              )}
              {field(
                "email",
                "Email",
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                />,
              )}
            </div>
            {field(
              "subject",
              "Subject",
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What's this about?"
              />,
            )}
            {field(
              "message",
              "Message",
              <Textarea
                id="message"
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your message…"
              />,
            )}
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </motion.div>
    </PublicLayout>
  );
}
