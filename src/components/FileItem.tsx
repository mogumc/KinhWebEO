"use client";

import React from "react";
import { FileEntry } from "@/lib/api";
import { formatBytes, getFileIcon } from "@/lib/utils";

interface FileItemProps {
  file: FileEntry;
  onOpen: (path: string, isdir: number) => void;
}

export default function FileItem({ file, onOpen }: FileItemProps) {
  const handleClick = () => {
    onOpen(file.path, file.isdir);
  };

  const icon = getFileIcon(file.filename || file.server_filename, file.isdir);

  const getIconBg = () => {
    if (file.isdir === 1) return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    const ext = (file.filename || file.server_filename).split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext)) return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
    if (["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"].includes(ext)) return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
    if (["mp3", "wav", "flac", "aac", "ogg", "m4a"].includes(ext)) return "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
    if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(ext)) return "linear-gradient(135deg, #fa709a 0%, #fee140 100%)";
    if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext)) return "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)";
    return "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)";
  };

  const getIconColor = () => {
    if (file.isdir === 1) return "#fff";
    const ext = (file.filename || file.server_filename).split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(ext)) return "#fff";
    if (["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"].includes(ext)) return "#fff";
    if (["mp3", "wav", "flac", "aac", "ogg", "m4a"].includes(ext)) return "#fff";
    if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(ext)) return "#fff";
    if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext)) return "#fff";
    return "var(--text-secondary)";
  };

  return (
    <div
      onClick={handleClick}
      className="group flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-tertiary)";
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.transform = "translateX(4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-secondary)";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateX(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{
          background: getIconBg(),
          color: getIconColor(),
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-medium truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {file.filename || file.server_filename}
        </div>
        {file.isdir === 0 && (
          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {formatBytes(file.size)}
          </div>
        )}
      </div>

      {/* Arrow */}
      <div
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: "var(--accent)" }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
