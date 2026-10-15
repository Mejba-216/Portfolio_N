import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Mail, ArrowRight, FileText } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SignedImage } from "@/components/SignedImage";
import { getProfile } from "@/lib/portfolio";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Md. Nahid Niaz Nayan — Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Md. Nahid Niaz Nayan, Computer Science & Engineering undergraduate at BRAC University specializing in IT operations, digital media, and software development.",
      },
      { property: "og:title", content: "Md. Nahid Niaz Nayan — Portfolio" },
      {
        property: "og:description",
        content:
          "Portfolio of Md. Nahid Niaz Nayan, Computer Science & Engineering undergraduate at BRAC University.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: profile, isLoading } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const reduceMotion = useReducedMotion();

  const textAnim = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const photoAnim = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 80 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <PublicLayout>
      {isLoading ? (
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="aspect-[4/5] w-full" />
        </div>
      ) : (
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.p {...textAnim(0)} className="section-title">
              Hello, I'm
            </motion.p>
            <motion.h1 {...textAnim(0.08)} className="mt-3 page-heading text-foreground">
              {profile?.full_name ?? "—"}
            </motion.h1>
            <motion.p
              {...textAnim(0.16)}
              className="mt-3 font-display text-xl font-semibold text-muted-foreground"
            >
              {profile?.title}
            </motion.p>
            <motion.p
              {...textAnim(0.24)}
              className="mt-6 max-w-lg leading-relaxed text-muted-foreground"
            >
              {profile?.bio}
            </motion.p>

            <motion.div
              {...textAnim(0.32)}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              {profile?.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {profile.location}
                </span>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4" /> {profile.email}
                </a>
              )}
            </motion.div>

            <motion.div {...textAnim(0.4)} className="mt-9 flex flex-wrap gap-3">
              <a
                href={profile?.resume_url ?? "/Cv.pdf"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <FileText className="h-4 w-4" /> View CV
              </a>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-foreground"
              >
                View Projects <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-foreground hover:text-foreground"
              >
                Contact Me
              </Link>
            </motion.div>
          </div>

          <motion.div {...photoAnim} className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-2xl shadow-black/10">
              <SignedImage
                fileRef={profile?.photo_url ?? "/Picture/Nayan.jpg"}
                alt={profile?.full_name ?? "Md. Nahid Niaz Nayan"}
                className="aspect-[4/5] w-full object-cover"
                fallback={
                  <div className="flex aspect-[4/5] w-full items-center justify-center bg-secondary">
                    <span className="font-display text-7xl font-extrabold text-muted-foreground/40">
                      {(profile?.full_name ?? "N N")
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  </div>
                }
              />
            </div>
            <div
              className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-2xl border-2 border-gold/40"
              aria-hidden
            />
          </motion.div>
        </div>
      )}
    </PublicLayout>
  );
}
