export interface FileEntry {
  fs_id: number;
  path: string;
  filename: string;
  size: number;
  isdir: number;
  server_filename: string;
  category: number;
  md5?: string;
  thumbs?: {
    icon?: string;
    image?: string;
    url1?: string;
    url2?: string;
    url3?: string;
  };
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface ListResponse {
  dir: string;
  list: FileEntry[];
}

export interface DownResponse {
  fid: number;
  dlink: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export async function fetchFileList(dir: string): Promise<ListResponse> {
  const res = await fetch(`${API_BASE}/api/list?dir=${encodeURIComponent(dir)}`);
  const json: ApiResponse<ListResponse> = await res.json();
  if (json.code !== 200) {
    throw new Error(json.message || "获取文件列表失败");
  }
  return json.data;
}

export async function fetchDownloadLink(
  fid: number,
  mode?: string
): Promise<DownResponse> {
  const params = new URLSearchParams({ fid: String(fid) });
  if (mode) params.set("m", mode);
  const res = await fetch(`${API_BASE}/api/down?${params.toString()}`);
  const json: ApiResponse<DownResponse> = await res.json();
  if (json.code !== 200) {
    throw new Error(json.message || "获取下载链接失败");
  }
  return json.data;
}
