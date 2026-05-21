"use client";

import React, { useState, useEffect, useCallback } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import FileList from "@/components/FileList";
import DownloadDialog from "@/components/DownloadDialog";
import Player from "@/components/Player";
import { fetchFileList, fetchDownloadLink, FileEntry } from "@/lib/api";
import { isImage, isVideo, isAudio } from "@/lib/utils";

export default function Home() {
  const [currentDir, setCurrentDir] = useState("/");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 下载弹窗状态
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");
  const [downloadFilename, setDownloadFilename] = useState("");

  // 播放器状态
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerUrl, setPlayerUrl] = useState("");
  const [playerFilename, setPlayerFilename] = useState("");
  const [playerType, setPlayerType] = useState<"video" | "audio" | "image">("video");

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

  // 获取文件预览/下载链接的通用处理
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

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">KinhWeb</h1>
        </div>
      </header>

      <main className="container mx-auto">
        <Breadcrumb path={currentDir} onNavigate={handleBreadcrumbNavigate} />
        <FileList
          files={files}
          loading={loading}
          error={error}
          onOpen={handleOpen}
        />
      </main>

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
