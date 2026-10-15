import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Bucket =
  | "profile-images"
  | "project-images"
  | "achievement-certificates"
  | "resume-files";

export const BUCKETS: Bucket[] = [
  "profile-images",
  "project-images",
  "achievement-certificates",
  "resume-files",
];

const MAX_SIZE: Record<Bucket, number> = {
  "profile-images": 10 * 1024 * 1024,
  "project-images": 10 * 1024 * 1024,
  "achievement-certificates": 20 * 1024 * 1024,
  "resume-files": 20 * 1024 * 1024,
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const CERT_TYPES = [...IMAGE_TYPES, "application/pdf"];

export function validateFile(
  bucket: Bucket,
  file: File,
): { ok: true } | { ok: false; error: string } {
  const allowed = bucket === "achievement-certificates" || bucket === "resume-files"
    ? CERT_TYPES
    : IMAGE_TYPES;
  if (!allowed.includes(file.type)) {
    return {
      ok: false,
      error:
        bucket === "achievement-certificates" || bucket === "resume-files"
          ? "Only PDF, JPG, PNG or WEBP files are allowed."
          : "Only JPG, PNG or WEBP images are allowed.",
    };
  }
  if (file.size > MAX_SIZE[bucket]) {
    return { ok: false, error: `File is too large (max ${MAX_SIZE[bucket] / 1024 / 1024} MB).` };
  }
  return { ok: true };
}

/** Upload a file and return the stored "bucket/path" reference. */
export async function uploadFile(bucket: Bucket, file: File): Promise<string> {
  const check = validateFile(bucket, file);
  if (!check.ok) throw new Error(check.error);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return `${bucket}/${path}`;
}

function splitRef(ref: string): { bucket: string; path: string } {
  const [bucket, ...rest] = ref.split("/");
  if (!bucket || rest.length === 0) throw new Error(`Invalid file reference: ${ref}`);
  return { bucket, path: rest.join("/") };
}

export async function deleteFile(ref: string): Promise<void> {
  const { bucket, path } = splitRef(ref);
  await supabase.storage.from(bucket).remove([path]);
}

/** Create a signed URL (valid 7 days) for a stored "bucket/path" reference or return direct URL. */
export async function getSignedUrl(ref: string): Promise<string> {
  if (!ref) return "";
  if (ref.startsWith("/") || ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("data:")) {
    return ref;
  }
  try {
    const { bucket, path } = splitRef(ref);
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 24 * 7);
    if (error || !data) return ref;
    return data.signedUrl;
  } catch {
    return ref;
  }
}

/** React hook: resolve a stored file reference to a displayable URL. */
export function useSignedUrl(ref: string | null | undefined) {
  return useQuery({
    queryKey: ["signed-url", ref],
    queryFn: () => getSignedUrl(ref!),
    enabled: !!ref,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
