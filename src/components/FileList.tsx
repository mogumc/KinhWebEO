"use client";

import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { FileEntry } from "@/lib/api";
import { formatBytes, getFileCategoryByFilename, FileCategory } from "@/lib/utils";
import {
  Folder,
  Image,
  Film,
  Music,
  FileText,
  Package,
  File,
  ChevronRight,
  Archive,
  AlignLeft,
} from "lucide-react";

interface FileListProps {
  files: FileEntry[];
  loading: boolean;
  onOpen: (file: FileEntry) => void;
}

const iconMap: Record<FileCategory, React.ReactNode> = {
  folder: <Folder size={24} />,
  image: <Image size={24} />,
  video: <Film size={24} />,
  music: <Music size={24} />,
  doc: <FileText size={24} />,
  app: <Package size={24} />,
  other: <File size={24} />,
  seed: <Package size={24} />,
  archive: <Archive size={24} />,
  text: <AlignLeft size={24} />,
};

export default function FileList({ files, loading, onOpen }: FileListProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight - 200 });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px 16px", textAlign: "center" }}>
        <div className="weui-loading weui-loading_dark" />
        <div style={{ fontSize: "13px", color: "var(--weui-FG-1)", marginTop: "8px" }}>
          加载中...
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--weui-FG-2)" }}>
        暂无文件
      </div>
    );
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const file = files[index];
    const cat = getFileCategoryByFilename(file.server_filename, file.isdir);
    const iconClass = `icon-${cat}`;
    const icon = iconMap[cat] || <File size={24} />;

    return (
      <div style={style} className="animate-fadeIn">
        <a
          href="javascript:void(0)"
          className="weui-media-box weui-media-box_appmsg"
          onClick={(e) => {
            e.preventDefault();
            onOpen(file);
          }}
          style={{ cursor: "pointer", height: "100%", width: "100%", display: "flex", alignItems: "center" }}
        >
          <div className={`weui-media-box__icon ${iconClass}`}>
            {icon}
          </div>
          <div className="weui-media-box__text">
            <div className="weui-media-box__title">{file.server_filename}</div>
            <div className="weui-media-box__desc">
              {file.isdir === 1 ? "文件夹" : (
                <span>{formatBytes(file.size)}</span>
              )}
            </div>
          </div>
          <div className="weui-media-box__ft">
            <ChevronRight size={16} color="var(--weui-FG-2)" />
          </div>
        </a>
      </div>
    );
  };

  return (
    <div style={{ height: "calc(100vh - 200px)" }}>
      <List
        height={windowSize.height}
        itemCount={files.length}
        itemSize={80}
        width={windowSize.width}
      >
        {Row}
      </List>
    </div>
  );
}
