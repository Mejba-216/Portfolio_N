import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { Award, Download, ExternalLink, FileText, X } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SignedImage } from "@/components/SignedImage";
import { getAchievements, formatDate, type Achievement } from "@/lib/portfolio";
import { useSignedUrl } from "@/lib/storage";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Md. Nahid Niaz Nayan" },
      { name: "description", content: "Awards, certifications, and leadership achievements of Md. Nahid Niaz Nayan." },
      { property: "og:title", content: "Achievements — Md. Nahid Niaz Nayan" },
      { property: "og:description", content: "Awards, certifications, and leadership achievements of Md. Nahid Niaz Nayan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AchievementsPage,
});

function CertificateViewer({
  achievement,
  onClose,
}: {
  achievement: Achievement | null;
  onClose: () => void;
}) {
  const signed = useSignedUrl(achievement?.certificate_url);
  const isPdf = achievement?.certificate_type === "application/pdf";

  return (
    <Dialog open={!!achievement} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl" aria-describedby={undefined}>
        <DialogTitle>{achievement?.title}</DialogTitle>
        {achievement && signed.data && (
          <div className="mt-2">
            {isPdf ? (
              <iframe
                src={signed.data}
                title={`Certificate: ${achievement.title}`}
                className="h-[70vh] w-full rounded-md border border-border"
              />
            ) : (
              <img
                src={signed.data}
                alt={`Certificate: ${achievement.title}`}
                className="max-h-[70vh] w-full rounded-md object-contain"
              />
            )}
            <div className="mt-4 flex justify-end">
              <a
                href={signed.data}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AchievementsPage() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
  });
  const [viewer, setViewer] = useState<Achievement | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <PublicLayout>
      <p className="section-title">Recognition</p>
      <h1 className="mt-2 page-heading">Achievements</h1>

      {isLoading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : !achievements?.length ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center text-muted-foreground">
          <Award className="h-10 w-10" />
          <p>No achievements added yet.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {achievements.map((a, i) => (
            <motion.article
              key={a.id}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
            >
              {a.certificate_url ? (
                <button
                  type="button"
                  onClick={() => setViewer(a)}
                  className="relative block overflow-hidden border-b border-border bg-muted text-left"
                  aria-label={`View certificate for ${a.title}`}
                >
                  {a.certificate_type === "application/pdf" ? (
                    <div className="flex aspect-[16/9] w-full items-center justify-center bg-secondary">
                      <FileText className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  ) : (
                    <SignedImage
                      fileRef={a.certificate_url}
                      alt={`Certificate: ${a.title}`}
                      className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </button>
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center border-b border-border bg-secondary">
                  <Award className="h-12 w-12 text-muted-foreground/40" />
                </div>
              )}

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[11px]">
                    {a.category}
                  </Badge>
                  {a.featured && (
                    <Badge className="bg-gold text-[11px] text-accent-foreground">Featured</Badge>
                  )}
                </div>
                <h2 className="mt-3 font-display text-lg font-bold">{a.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {a.organization}
                  {a.achievement_date ? ` · ${formatDate(a.achievement_date)}` : ""}
                </p>
                {a.credential_id && (
                  <p className="mt-1 text-xs text-muted-foreground/80">
                    <span className="font-semibold text-foreground/80">Credential ID:</span>{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">{a.credential_id}</code>
                  </p>
                )}
                {a.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{a.description}</p>
                )}
                <div className="mt-auto flex items-center gap-4 pt-4">
                  {a.certificate_url && (
                    <button
                      type="button"
                      onClick={() => setViewer(a)}
                      className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                    >
                      View certificate
                    </button>
                  )}
                  {a.credential_url && (
                    <a
                      href={a.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Verify <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <CertificateViewer achievement={viewer} onClose={() => setViewer(null)} />
    </PublicLayout>
  );
}
