"use client";

import React, { useState, useEffect, useCallback } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import FileList from "@/components/FileList";
import ActionSheet from "@/components/ActionSheet";
import Gallery from "@/components/Gallery";
import Toast from "@/components/Toast";
import ThemeToggle from "@/components/ThemeToggle";
import { getFileCategory, formatBytes } from "@/lib/utils";
import { fetchSiteConfig, fetchFileList, fetchDownloadLink, fetchSearch, FileEntry, SiteConfig } from "@/lib/api";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function Home() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ title: "KinhWeb", foot: "" });
  const [currentDir, setCurrentDir] = useState("/");
  const [searchKey, setSearchKey] = useState("");
  
  const handleSearch = () => {
    setKeyword(searchKey);
  };
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [readme, setReadme] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; text: string; type?: "error" | "loading" }>({ show: false, text: "" });

  // ActionSheet
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);

  // Gallery
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryUrl, setGalleryUrl] = useState("");
  const [galleryType, setGalleryType] = useState<"image" | "video">("image");
  const [galleryFilename, setGalleryFilename] = useState("");

  const showToast = (text: string, type?: "error" | "loading", duration = 2000) => {
    setToast({ show: true, text, type });
    if (type !== "loading") {
      setTimeout(() => setToast({ show: false, text: "" }), duration);
    }
  };

  // 拉取站点配置
  useEffect(() => {
    fetchSiteConfig().then(setSiteConfig).catch(() => {});
  }, []);

  const loadFiles = useCallback(async (dir: string, key?: string) => {
    setLoading(true);
    setReadme(""); // 清空 README
    showToast(key ? "搜索中" : "获取文件列表中", "loading");
    try {
      const data = key ? await fetchSearch(key, dir) : await fetchFileList(dir);
      setFiles(data.list || []);
      
      // 前端查找 README
      const readmeFile = data.list.find((file: FileEntry) => 
        file.server_filename.toLowerCase() === "readme.md"
      );
      
      if (readmeFile) {
        try {
          const cacheKey = `readme_cache_${readmeFile.fs_id}`;
          const cached = localStorage.getItem(cacheKey);
          
          let useCache = false;
          if (cached) {
            const cacheData = JSON.parse(cached);
            if (cacheData.size === readmeFile.size && (cacheData.md5 === readmeFile.md5)) {
              setReadme(cacheData.content);
              useCache = true;
            }
          }

          if (!useCache) {
            const res = await fetch(`/api/readme?fid=${readmeFile.fs_id}`);
            if (res.ok) {
              const content = await res.text();
              setReadme(content);
              localStorage.setItem(cacheKey, JSON.stringify({
                md5: readmeFile.md5,
                size: readmeFile.size,
                content: content
              }));
            } else {
              setReadme(""); // 降级：fetch失败则不显示
            }
          }
        } catch (e) {
          console.error("获取 README 失败", e);
          setReadme(""); // 降级：异常则不显示
        }
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "获取失败");
    } finally {
      setLoading(false);
      setToast({ show: false, text: "" });
    }
  }, []);

  useEffect(() => {
    loadFiles(currentDir, keyword);
  }, [currentDir, keyword, loadFiles]);

  useEffect(() => {
    document.title = siteConfig.title || "KinhWeb";
  }, [siteConfig.title]);

  const handleOpenFile = (file: FileEntry) => {
    if (file.isdir === 1) {
      setCurrentDir(file.path);
      return;
    }
    setSelectedFile(file);
    setSheetOpen(true);
  };

  // 获取下载直链
  const getDownloadUrl = (fid: number) => {
    const base = process.env.NEXT_PUBLIC_API_BASE || window.location.origin;
    return `${base}/api/down?fid=${fid}&m=.baidu.com`;
  };

  // 复制到剪贴板
  const handleCopyLink = async (file: FileEntry) => {
    setSheetOpen(false);
    const url = getDownloadUrl(file.fs_id);
    try {
      await navigator.clipboard.writeText(url);
      showToast("已复制到粘贴板");
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      showToast("已复制到粘贴板");
    }
  };

  // 直接下载
  const handleDownload = (file: FileEntry) => {
    setSheetOpen(false);
    const url = getDownloadUrl(file.fs_id);
    const a = document.createElement("a");
    a.href = url;
    a.rel = "noreferrer";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("获取下载地址成功");
  };

  // 预览
  const handlePreview = async (file: FileEntry) => {
    setSheetOpen(false);
    showToast("预览准备中...", "loading");
    try {
      const data = await fetchDownloadLink(file.fs_id);
      const url = data.dlink;
      const cat = getFileCategory(file.category);

      if (cat === "image" || cat === "video" || cat === "music") {
        setGalleryUrl(url);
        setGalleryType(cat === "image" ? "image" : "video");
        setGalleryFilename(file.server_filename);
        setGalleryOpen(true);
      } else {
        showToast("不支持的预览格式");
      }
    } catch {
      showToast("获取预览链接失败");
    } finally {
        setToast({ show: false, text: "" });
    }
  };

  const selectedFileCategory = selectedFile ? getFileCategory(selectedFile.category) : null;
  const canPreview = selectedFileCategory === "video" || selectedFileCategory === "image";

  return (
    <div style={{ minHeight: "100vh", background: "var(--weui-BG-1)" }}>
      <ThemeToggle />
      {/* Title */}
      <h2 className="weui-form__title">{siteConfig.title || "KinhWeb"}</h2>

      {/* Search Bar */}
      <div style={{ padding: "0 16px 8px", display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="搜索文件..."
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid var(--weui-FG-3)",
            background: "var(--weui-BG-2)",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            background: "var(--weui-BG-3)",
            cursor: "pointer",
          }}
        >
          搜索
        </button>
      </div>

      {/* Main Container */}
      <div className="weui-panel" style={{ margin: "8px 0" }}>
        <div className="weui-panel__hd">文件列表</div>
        <div style={{ padding: "4px 8px" }}>
          {keyword ? (
              <div style={{ padding: "4px", fontSize: "14px" }}>搜索: {keyword}</div>
          ) : (
            <Breadcrumb path={currentDir} onNavigate={setCurrentDir} />
          )}
        </div>
        <FileList
          files={files}
          loading={loading}
          onOpen={handleOpenFile}
        />
      </div>

      {readme && (
        <div className="weui-panel" style={{ margin: "8px 16px", padding: "16px", background: "var(--weui-BG-2)" }}>
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked.parse(readme) as string),
            }}
          />
        </div>
      )}

      {/* Footer */}
      <div className="weui-footer">
        {siteConfig.foot && <div className="weui-footer__text">{siteConfig.foot}</div>}
        <div className="weui-footer__text">
          Copyright &copy; 2019-2026 Powered By KinhWeb with WeUI
        </div>
      </div>

      {/* ActionSheet */}
      <ActionSheet
        open={sheetOpen}
        filename={selectedFile?.server_filename || ""}
        canPreview={canPreview}
        onClose={() => setSheetOpen(false)}
        onCopyLink={() => selectedFile && handleCopyLink(selectedFile)}
        onDownload={() => selectedFile && handleDownload(selectedFile)}
        onPreview={() => selectedFile && handlePreview(selectedFile)}
      />

      {/* Gallery */}
      <Gallery
        open={galleryOpen}
        url={galleryUrl}
        type={galleryType}
        filename={galleryFilename}
        onClose={() => setGalleryOpen(false)}
      />

      {/* Toast */}
      <Toast show={toast.show} text={toast.text} type={toast.type} />
    </div>
  );
}
