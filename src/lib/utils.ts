export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// 百度网盘 category 值映射
export type FileCategory = "video" | "music" | "image" | "doc" | "app" | "other" | "seed" | "folder" | "archive" | "text";

export function getFileCategory(category: number): FileCategory {
  switch (category) {
    case 1: return "video";
    case 2: return "music";
    case 3: return "image";
    case 4: return "doc";
    case 5: return "app";
    case 6: return "other";
    case 7: return "seed";
    default: return "other";
  }
}

export function getFileCategoryText(category: number): string {
  switch (category) {
    case 1: return "视频";
    case 2: return "音乐";
    case 3: return "图片";
    case 4: return "文档";
    case 5: return "应用";
    case 6: return "其他";
    case 7: return "种子";
    default: return "未知类型";
  }
}

export function getFileCategoryByFilename(filename: string, isdir: number): FileCategory {
  if (isdir === 1) return "folder";
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "tiff", "tif"];
  const videoExts = ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm", "mpg", "mpeg", "m4v", "3gp", "ts", "vob"];
  const audioExts = ["mp3", "wav", "flac", "aac", "ogg", "m4a", "wma", "opus", "ape"];
  const docExts = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
  const textExts = ["txt", "md", "json", "xml", "yaml", "yml", "toml", "ini", "cfg", "conf", "log", "csv", "tsv", "html", "htm", "css", "js", "ts", "jsx", "tsx", "py", "go", "java", "c", "cpp", "h", "rs", "sh", "bat", "ps1", "sql", "php", "rb", "swift", "kt", "dart", "lua", "r", "perl", "pl", "pm"];
  const archiveExts = ["zip", "rar", "7z", "tar", "gz", "bz2", "xz", "zst", "lz4", "iso", "img", "dmg", "cab"];
  const seedExts = ["torrent"];
  const pandExts = ["pand"];

  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  if (audioExts.includes(ext)) return "music";
  if (pandExts.includes(ext)) return "text";
  if (textExts.includes(ext)) return "text";
  if (docExts.includes(ext)) return "doc";
  if (archiveExts.includes(ext)) return "archive";
  if (seedExts.includes(ext)) return "seed";
  return "other";
}

export function isImage(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico", "tiff", "tif"].includes(ext);
}

export function isVideo(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm", "mpg", "mpeg", "m4v", "3gp", "ts", "vob"].includes(ext);
}

export function isAudio(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ["mp3", "wav", "flac", "aac", "ogg", "m4a", "wma", "opus", "ape"].includes(ext);
}
