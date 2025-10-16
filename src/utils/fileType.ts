const VIDEO_EXTENSIONS = ["mp4", "mov", "avi", "mkv", "webm", "3gp"];

export type FileType = "image" | "video" | "unknown";

export function getFileType(uri: string): FileType {
  const extension = uri.split(".").pop()?.toLowerCase();

  if (!extension) return "unknown";
  
  return VIDEO_EXTENSIONS.includes(extension) ? "video" : "image";
}
