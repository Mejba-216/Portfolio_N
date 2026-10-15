import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "motion/react";
import { Download, Maximize2, Palette } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SignedImage } from "@/components/SignedImage";
import { getPosterDesigns, type PosterDesign } from "@/lib/portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/designs")({
  head: () => ({
    meta: [
      { title: "Digital Media Poster Designs — Md. Nahid Niaz Nayan" },
      {
        name: "description",
        content:
          "Digital media poster designs, event branding, and promotional visual media created by Md. Nahid Niaz Nayan for BUNSC, BURT, and BRAC University events.",
      },
      { property: "og:title", content: "Digital Media Poster Designs — Md. Nahid Niaz Nayan" },
      {
        property: "og:description",
        content:
          "Creative portfolio of digital media poster designs and promotional visual campaigns by Md. Nahid Niaz Nayan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DesignsPage,
});

function PosterLightbox({
  poster,
  onClose,
}: {
  poster: PosterDesign | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!poster} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
            <div>
              <DialogTitle className="font-display text-xl font-bold">
                {poster?.title}
              </DialogTitle>
              {poster?.category && (
                <Badge variant="secondary" className="mt-2 text-[11px]">
                  {poster.category}
                </Badge>
              )}
            </div>
            {poster?.image_url && (
              <a
                href={poster.image_url}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <Download className="h-3.5 w-3.5" /> Download Design
              </a>
            )}
          </div>

          {poster && (
            <div className="flex items-center justify-center overflow-hidden rounded-lg bg-secondary/50 p-2">
              <img
                src={poster.image_url}
                alt={poster.title}
                className="max-h-[70vh] w-auto max-w-full rounded-md object-contain shadow-md"
              />
            </div>
          )}

          {poster?.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {poster.description}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DesignsPage() {
  const { data: designs, isLoading } = useQuery({
    queryKey: ["poster-designs"],
    queryFn: getPosterDesigns,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePoster, setActivePoster] = useState<PosterDesign | null>(null);
  const reduceMotion = useReducedMotion();

  const categories = ["All", ...new Set((designs ?? []).map((d) => d.category))];

  const filteredDesigns = (designs ?? []).filter((d) =>
    selectedCategory === "All" ? true : d.category === selectedCategory,
  );

  return (
    <PublicLayout>
      <p className="section-title">Creative Portfolio</p>
      <h1 className="mt-2 page-heading">Digital Media Poster Designs</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
        A collection of event branding, promotional posters, social awareness campaigns, and apparel
        mockups designed using Canva Pro and digital media tools for the BRAC University Natural
        Sciences Club (BUNSC), BRAC University Response Team (BURT), and university community events.
      </p>

      {/* Category Filter Tabs */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : !filteredDesigns.length ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center text-muted-foreground">
          <Palette className="h-10 w-10 text-muted-foreground/60" />
          <p>No poster designs found in this category.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDesigns.map((poster, index) => (
            <motion.article
              key={poster.id}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
            >
              {/* Poster Image Preview */}
              <button
                type="button"
                onClick={() => setActivePoster(poster)}
                className="relative block aspect-[4/5] w-full overflow-hidden border-b border-border bg-muted text-left focus:outline-none"
                aria-label={`View full design for ${poster.title}`}
              >
                <SignedImage
                  fileRef={poster.image_url}
                  alt={poster.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-secondary">
                      <Palette className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  }
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow">
                    <Maximize2 className="h-3.5 w-3.5" /> View Design
                  </span>
                </div>
              </button>

              {/* Card Details */}
              <div className="flex flex-1 flex-col p-4">
                <div>
                  <Badge variant="secondary" className="text-[10px]">
                    {poster.category}
                  </Badge>
                  <h2 className="mt-2 font-display text-base font-bold leading-snug group-hover:text-primary">
                    {poster.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {poster.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setActivePoster(poster)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-foreground underline-offset-4 hover:underline"
                  >
                    <Maximize2 className="h-3 w-3" /> Full View
                  </button>
                  <a
                    href={poster.image_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-3 w-3" /> Download
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <PosterLightbox poster={activePoster} onClose={() => setActivePoster(null)} />
    </PublicLayout>
  );
}
