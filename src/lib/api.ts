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

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ListResponse {
  dir: string;
  list: FileEntry[];
  readme?: string;
}

export interface DownResponse {
  fid: number;
  dlink: string;
}

export interface SiteConfig {
  title: string;
  foot: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000); // 10秒超时

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { 
      ...options, 
      signal: controller.signal 
    });
    clearTimeout(id);

    if (!res.ok) {
      throw new Error(`请求失败: ${res.status} ${res.statusText}`);
    }
    
    const json: ApiResponse<T> = await res.json();
    if (json.code !== 200) {
      throw new Error(json.message || "请求业务失败");
    }
    return json.data;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error("请求超时");
    }
    throw err;
  }
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  return request<SiteConfig>("/api/config");
}

export async function fetchFileList(dir: string): Promise<ListResponse> {
  return request<ListResponse>(`/api/list?dir=${encodeURIComponent(dir)}`);
}

export async function fetchSearch(key: string, dir: string = "/"): Promise<ListResponse> {
  const cacheKey = `search_${key}_${dir}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    console.log(`[Frontend Cache] Hit for ${cacheKey}`);
    return JSON.parse(cached);
  }

  const data = await request<ListResponse>(`/api/search?key=${encodeURIComponent(key)}&dir=${encodeURIComponent(dir)}`);
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
}

export async function fetchDownloadLink(
  fid: number,
  mode?: string
): Promise<DownResponse> {
  const params = new URLSearchParams({ fid: String(fid) });
  if (mode) params.set("m", mode);
  return request<DownResponse>(`/api/down?${params.toString()}`);
}
