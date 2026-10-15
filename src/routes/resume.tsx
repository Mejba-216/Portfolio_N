import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { Download, ExternalLink } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  getProfile,
  getEducation,
  getExperience,
  getSkills,
  getCertifications,
  getLanguages,
  getAwards,
  formatDateRange,
  formatDate,
} from "@/lib/portfolio";
import { useSignedUrl } from "@/lib/storage";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Md. Nahid Niaz Nayan" },
      { name: "description", content: "Resume and CV of Md. Nahid Niaz Nayan: experience, education, skills, certifications and leadership." },
      { property: "og:title", content: "Resume — Md. Nahid Niaz Nayan" },
      { property: "og:description", content: "Resume and CV of Md. Nahid Niaz Nayan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResumePage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="section-title">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ResumePage() {
  const reduceMotion = useReducedMotion();
  const profile = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const education = useQuery({ queryKey: ["education"], queryFn: getEducation });
  const experience = useQuery({ queryKey: ["experience"], queryFn: getExperience });
  const skills = useQuery({ queryKey: ["skills"], queryFn: getSkills });
  const certifications = useQuery({ queryKey: ["certifications"], queryFn: getCertifications });
  const languages = useQuery({ queryKey: ["languages"], queryFn: getLanguages });
  const awards = useQuery({ queryKey: ["awards"], queryFn: getAwards });
  const resumeUrl = useSignedUrl(profile.data?.resume_url ?? "/Cv.pdf");

  const loading =
    profile.isLoading || education.isLoading || experience.isLoading || skills.isLoading;

  const skillCategories = [...new Set((skills.data ?? []).map((s) => s.category))];

  return (
    <PublicLayout>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-title">Curriculum Vitae</p>
            <h1 className="mt-2 page-heading">Resume</h1>
          </div>
          <a
            href={resumeUrl.data || profile.data?.resume_url || "/Cv.pdf"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" /> Download Resume
          </a>
        </div>

        {loading ? (
          <div className="mt-10 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <>
            {profile.data?.summary && (
              <Section title="Professional Summary">
                <p className="max-w-3xl leading-relaxed text-muted-foreground">
                  {profile.data.summary}
                </p>
              </Section>
            )}

            {!!experience.data?.length && (
              <Section title="Work Experience">
                <ol className="relative space-y-8 border-l border-border pl-6">
                  {experience.data.map((e) => (
                    <li key={e.id} className="relative">
                      <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-gold bg-background" />
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display text-lg font-bold">{e.position}</h3>
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {formatDateRange(e.start_date, e.end_date)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {e.company}
                        {e.location ? ` · ${e.location}` : ""}
                      </p>
                      {e.description && (
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                          {e.description}
                        </p>
                      )}
                      {!!e.technologies?.length && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {e.technologies.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {!!education.data?.length && (
              <Section title="Education">
                <ol className="relative space-y-8 border-l border-border pl-6">
                  {education.data.map((e) => (
                    <li key={e.id} className="relative">
                      <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-gold bg-background" />
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display text-lg font-bold">{e.degree}</h3>
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {formatDateRange(e.start_date, e.end_date)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {e.institution}
                        {e.location ? ` · ${e.location}` : ""}
                      </p>
                      {e.description && (
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                          {e.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {!!skills.data?.length && (
              <Section title="Skills">
                <div className="grid gap-6 sm:grid-cols-2">
                  {skillCategories.map((cat) => (
                    <div key={cat} className="rounded-lg border border-border bg-card p-5">
                      <h3 className="text-sm font-semibold">{cat}</h3>
                      <ul className="mt-3 space-y-2.5">
                        {skills.data!
                          .filter((s) => s.category === cat)
                          .map((s) => (
                            <li key={s.id} className="flex items-center justify-between gap-3">
                              <span className="text-sm text-muted-foreground">{s.name}</span>
                              <span className="flex gap-1" aria-label={`Level ${s.level} of 5`}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`h-1.5 w-4 rounded-full ${i < s.level ? "bg-gold" : "bg-border"}`}
                                  />
                                ))}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {!!certifications.data?.length && (
              <Section title="Certifications">
                <div className="grid gap-4 sm:grid-cols-2">
                  {certifications.data.map((c) => (
                    <div key={c.id} className="rounded-lg border border-border bg-card p-5">
                      <h3 className="font-display font-bold">{c.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {c.organization}
                        {c.issue_date ? ` · ${formatDate(c.issue_date)}` : ""}
                      </p>
                      {c.credential_id && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Credential ID: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">{c.credential_id}</code>
                        </p>
                      )}
                      {c.credential_url && (
                        <a
                          href={c.credential_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-foreground underline-offset-4 hover:underline"
                        >
                          Verify credential <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {!!awards.data?.length && (
              <Section title="Awards">
                <ul className="space-y-4">
                  {awards.data.map((a) => (
                    <li key={a.id} className="rounded-lg border border-border bg-card p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display font-bold">{a.title}</h3>
                        <span className="text-xs text-muted-foreground">{formatDate(a.award_date)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{a.organization}</p>
                      {a.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {!!languages.data?.length && (
              <Section title="Languages">
                <ul className="flex flex-wrap gap-3">
                  {languages.data.map((l) => (
                    <li
                      key={l.id}
                      className="rounded-full border border-border px-4 py-1.5 text-sm"
                    >
                      <span className="font-semibold">{l.language}</span>
                      {l.level && <span className="text-muted-foreground"> — {l.level}</span>}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </>
        )}
      </motion.div>
    </PublicLayout>
  );
}
