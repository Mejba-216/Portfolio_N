import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, FolderOpen } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SignedImage } from "@/components/SignedImage";
import { getProjects } from "@/lib/portfolio";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Md. Nahid Niaz Nayan" },
      { name: "description", content: "Selected IT, software, and digital media projects by Md. Nahid Niaz Nayan." },
      { property: "og:title", content: "Projects — Md. Nahid Niaz Nayan" },
      { property: "og:description", content: "Selected IT, software, and digital media projects by Md. Nahid Niaz Nayan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(true),
  });
  const reduceMotion = useReducedMotion();

  const isExact = pathname === "/projects" || pathname === "/projects/";
  if (!isExact) {
    return <Outlet />;
  }

  return (
    <PublicLayout>
      <p className="section-title">Selected Work</p>
      <h1 className="mt-2 page-heading">Projects</h1>

      {isLoading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : !projects?.length ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center text-muted-foreground">
          <FolderOpen className="h-10 w-10" />
          <p>No projects published yet.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <Link
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
              >
                <div className="overflow-hidden border-b border-border bg-muted">
                  <SignedImage
                    fileRef={p.cover_image_url}
                    alt={p.title}
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    fallback={
                      <div className="flex aspect-[16/9] w-full items-center justify-center bg-secondary">
                        <span className="font-display text-4xl font-extrabold text-muted-foreground/30">
                          {p.title.slice(0, 1)}
                        </span>
                      </div>
                    }
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-display text-lg font-bold">{p.title}</h2>
                    {p.year && (
                      <span className="text-xs font-medium text-muted-foreground">{p.year}</span>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {p.short_description}
                  </p>
                  {!!p.technologies?.length && (
                    <p className="mt-3 text-xs font-medium tracking-wide text-muted-foreground">
                      {p.technologies.slice(0, 4).join(" · ")}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    View Project
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PublicLayout>
  );
}
