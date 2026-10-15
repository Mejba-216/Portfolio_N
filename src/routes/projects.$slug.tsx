import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Github, ExternalLink, CheckCircle2 } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SignedImage } from "@/components/SignedImage";
import { getProjectBySlug, getProjectImages } from "@/lib/portfolio";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/projects/$slug")({
  head: () => ({
    meta: [
      { title: "Project Details — Md. Nahid Niaz Nayan" },
      { name: "description", content: "Project details from the portfolio of Md. Nahid Niaz Nayan." },
      { property: "og:title", content: "Project Details — Md. Nahid Niaz Nayan" },
      { property: "og:description", content: "Project details from the portfolio of Md. Nahid Niaz Nayan." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectDetailsPage,
});

function ProjectDetailsPage() {
  const { slug } = Route.useParams();
  const reduceMotion = useReducedMotion();
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(slug),
  });
  const { data: images } = useQuery({
    queryKey: ["project-images", project?.id],
    queryFn: () => getProjectImages(project!.id),
    enabled: !!project?.id,
  });

  return (
    <PublicLayout>
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : !project ? (
        <div className="mt-16 text-center text-muted-foreground">
          <p>This project doesn't exist or isn't published.</p>
        </div>
      ) : (
        <motion.article
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h1 className="page-heading">{project.title}</h1>
            {project.year && (
              <span className="font-display text-sm font-semibold text-muted-foreground">
                {project.year}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-foreground"
              >
                <Github className="h-4 w-4" /> Source Code
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            )}
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-muted">
            <SignedImage
              fileRef={project.cover_image_url}
              alt={project.title}
              className="aspect-video w-full object-cover"
              fallback={
                <div className="flex aspect-video w-full items-center justify-center bg-secondary">
                  <span className="font-display text-6xl font-extrabold text-muted-foreground/30">
                    {project.title.slice(0, 1)}
                  </span>
                </div>
              }
            />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="section-title">About this project</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{project.description}</p>

              {!!project.features?.length && (
                <>
                  <h2 className="section-title mt-10">Key features</h2>
                  <ul className="mt-4 space-y-2.5">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div>
              <h2 className="section-title">Technologies</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {!!images?.length && (
            <div className="mt-12">
              <h2 className="section-title">Gallery</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {images.map((img) => (
                  <div key={img.id} className="overflow-hidden rounded-lg border border-border">
                    <SignedImage
                      fileRef={img.image_url}
                      alt={img.alt || project.title}
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      )}
    </PublicLayout>
  );
}
