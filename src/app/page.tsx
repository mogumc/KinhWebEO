"use client";

import React, { useState, useEffect, useCallback } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import FileList from "@/components/FileList";
import ActionSheet from "@/components/ActionSheet";
import Gallery from "@/components/Gallery";
import Toast from "@/components/Toast";
import { fetchSiteConfig, fetchFileList, fetchDownloadLink, FileEntry, SiteConfig } from "@/lib/api";
import { isImage, isVideo, isAudio, getFileCategory, formatBytes } from "@/lib/utils";

export default function Home() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ title: "KinhWeb", foot: "" });
  const [currentDir, setCurrentDir] = useState("/");
  const [files, setFiles] = useState<FileEntry[]>([]);
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

  const loadFiles = useCallback(async (dir: string) => {
    setLoading(true);
    showToast("获取文件列表中", "loading");
    try {
      const data = await fetchFileList(dir);
      setFiles(data.list || []);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "获取失败");
    } finally {
      setLoading(false);
      setToast({ show: false, text: "" });
    }
  }, []);

  useEffect(() => {
    loadFiles(currentDir);
  }, [currentDir, loadFiles]);

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
    window.open(url);
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

      if (cat === "image") {
        setGalleryUrl(url);
        setGalleryType("image");
        setGalleryFilename(file.server_filename);
        setGalleryOpen(true);
      } else if (cat === "video" || cat === "music") {
        setGalleryUrl(url);
        setGalleryType("video");
        setGalleryFilename(file.server_filename);
        setGalleryOpen(true);
      } else {
        showToast("不支持的预览格式");
      }
    } catch {
      showToast("获取预览链接失败");
    }
    setToast({ show: false, text: "" });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--weui-BG-1)" }}>
      {/* Title */}
      <h2 className="weui-form__title">{siteConfig.title || "KinhWeb"}</h2>

      {/* Main Container */}
      <div className="weui-panel" style={{ margin: "8px 0" }}>
        <div className="weui-panel__hd">文件列表</div>
        <div style={{ padding: "4px 8px" }}>
          <Breadcrumb path={currentDir} onNavigate={setCurrentDir} />
        </div>
        <FileList
          files={files}
          loading={loading}
          onOpen={handleOpenFile}
        />
      </div>

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
        isVideo={selectedFile ? getFileCategory(selectedFile.category) === "video" : false}
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
