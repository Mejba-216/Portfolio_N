import { useSignedUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface SignedImageProps {
  fileRef: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

/** Renders an image stored in a private storage bucket via a signed URL or direct path. */
export function SignedImage({ fileRef, alt, className, fallback }: SignedImageProps) {
  const isDirect =
    fileRef?.startsWith("/") ||
    fileRef?.startsWith("http://") ||
    fileRef?.startsWith("https://") ||
    fileRef?.startsWith("data:");

  const { data: url, isLoading } = useSignedUrl(isDirect ? null : fileRef);

  if (!fileRef) return <>{fallback ?? null}</>;

  const displayUrl = isDirect ? fileRef : url;

  if (!isDirect && (isLoading || !displayUrl)) {
    return <div className={cn("animate-pulse bg-muted", className)} aria-hidden />;
  }

  return (
    <img
      src={displayUrl ?? undefined}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        if (fallback) {
          e.currentTarget.style.display = "none";
        }
      }}
    />
  );
}
