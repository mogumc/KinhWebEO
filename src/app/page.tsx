"use client";

import React, { useState, useEffect, useCallback } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import FileList from "@/components/FileList";
import DownloadDialog from "@/components/DownloadDialog";
import Player from "@/components/Player";
import { fetchSiteConfig, fetchFileList, fetchDownloadLink, FileEntry, SiteConfig } from "@/lib/api";
import { isImage, isVideo, isAudio } from "@/lib/utils";

export default function Home() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ title: "KinhWeb", foot: "" });
  const [currentDir, setCurrentDir] = useState("/");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [downloadOpen, setDownloadOpen] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [downloadFilename, setDownloadFilename] = useState("");

  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerUrl, setPlayerUrl] = useState("");
  const [playerFilename, setPlayerFilename] = useState("");
  const [playerType, setPlayerType] = useState<"video" | "audio" | "image">("video");

  // 拉取站点配置
  useEffect(() => {
    fetchSiteConfig().then(setSiteConfig).catch(() => {});
  }, []);

  const loadFiles = useCallback(async (dir: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFileList(dir);
      setFiles(data.list || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles(currentDir);
  }, [currentDir, loadFiles]);

  const handleFileAction = async (
    path: string,
    action: "preview" | "download",
    previewType?: "video" | "audio" | "image"
  ) => {
    const filename = path.split("/").pop() || "未知文件";
    try {
      const fid = files.find((f) => f.path === path)?.fs_id;
      if (!fid) return;
      const data = await fetchDownloadLink(fid);

      if (action === "download") {
        setDownloadLink(data.dlink);
        setDownloadFilename(filename);
        setDownloadOpen(true);
      } else if (previewType) {
        setPlayerUrl(data.dlink);
        setPlayerFilename(filename);
        setPlayerType(previewType);
        setPlayerOpen(true);
      }
    } catch {
      alert(action === "download" ? "获取下载链接失败" : "获取预览链接失败");
    }
  };

  const handleOpen = async (path: string, isdir: number) => {
    if (isdir === 1) {
      setCurrentDir(path);
      return;
    }

    const filename = path.split("/").pop() || "";
    if (isImage(filename)) {
      await handleFileAction(path, "preview", "image");
    } else if (isVideo(filename)) {
      await handleFileAction(path, "preview", "video");
    } else if (isAudio(filename)) {
      await handleFileAction(path, "preview", "audio");
    } else {
      await handleFileAction(path, "download");
    }
  };

  const handleBreadcrumbNavigate = (path: string) => {
    setCurrentDir(path);
  };

  // 动态 <title>
  useEffect(() => {
    document.title = siteConfig.title || "KinhWeb";
  }, [siteConfig.title]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 glass" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold"
              style={{ background: "var(--accent-gradient)" }}
            >
              {siteConfig.title?.charAt(0) || "K"}
            </div>
            <div>
              <h1
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {siteConfig.title || "KinhWeb"}
              </h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                百度网盘文件管理
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-14">
        <div className="animate-fadeIn">
          <Breadcrumb path={currentDir} onNavigate={handleBreadcrumbNavigate} />
        </div>

        <div className="mt-6 animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <FileList
            files={files}
            loading={loading}
            error={error}
            onOpen={handleOpen}
          />
        </div>
      </main>

      {/* Footer */}
      {siteConfig.foot && (
        <footer
          className="fixed bottom-0 left-0 right-0 py-3 text-center text-xs z-30"
          style={{
            background: "var(--bg-secondary)",
            borderTop: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          {siteConfig.foot}
        </footer>
      )}

      <DownloadDialog
        open={downloadOpen}
        dlink={downloadLink}
        filename={downloadFilename}
        onClose={() => setDownloadOpen(false)}
      />

      <Player
        open={playerOpen}
        url={playerUrl}
        filename={playerFilename}
        type={playerType}
        onClose={() => setPlayerOpen(false)}
      />
    </div>
  );
}
