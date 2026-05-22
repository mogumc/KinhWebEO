"use client";

import React, { memo, useMemo, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";
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

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const Row = memo(({ data, index, style }: { data: { files: FileEntry[], onOpen: (f: FileEntry) => void }, index: number; style: React.CSSProperties }) => {
  const file = data.files[index];
  const onOpen = data.onOpen;
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
        style={{ cursor: "pointer", height: "100%", width: "100%", display: "flex", alignItems: "center", textDecoration: "none" }}
      >
        <div className={`weui-media-box__icon ${iconClass}`}>
          {icon}
        </div>
        <div className="weui-media-box__text">
          <div className="weui-media-box__title">{file.server_filename}</div>
          <div className="weui-media-box__desc">
             <span>{formatDate(file.server_mtime)}</span>
             <span style={{ marginLeft: "8px" }}>
                {file.isdir === 1 ? "文件夹" : formatBytes(file.size)}
             </span>
          </div>
        </div>
        <div className="weui-media-box__ft">
          <ChevronRight size={16} color="var(--weui-FG-2)" />
        </div>
      </a>
    </div>
  );
});

Row.displayName = 'Row';

export default function FileList({ files, loading, onOpen }: FileListProps) {
  const [sortBy, setSortBy] = useState<"name" | "time" | "size">("name");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const handleSortChange = (newSortBy: "name" | "time" | "size") => {
    if (sortBy === newSortBy) {
      setShowSortOptions(false);
    } else {
      setSortBy(newSortBy);
      setShowSortOptions(false);
    }
  };

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      // 文件夹优先
      if (a.isdir !== b.isdir) return b.isdir - a.isdir;
      
      // 按类型排序
      switch (sortBy) {
        case "time": return b.server_mtime - a.server_mtime;
        case "size": return b.size - a.size;
        case "name":
        default: return a.server_filename.localeCompare(b.server_filename);
      }
    });
  }, [files, sortBy]);

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

  const renderList = (size: { height: number | undefined; width: number | undefined }) => (
    <List
      height={size.height ?? 0}
      itemCount={sortedFiles.length}
      itemSize={80}
      width={size.width ?? 0}
      itemData={{ files: sortedFiles, onOpen }}
    >
      {Row as any}
    </List>
  );

  return (
    <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
      <div style={{ padding: "8px 16px", position: "relative" }}>
        <button
          onClick={() => setShowSortOptions(!showSortOptions)}
          style={{
            padding: "4px 12px",
            borderRadius: "4px",
            border: "none",
            background: "var(--weui-BG-2)",
            cursor: "pointer",
          }}
        >
          排序: {sortBy === "name" ? "名称" : sortBy === "time" ? "时间" : "大小"}
        </button>
        {showSortOptions && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "16px",
              background: "var(--weui-BG-2)",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              zIndex: 10,
              padding: "4px 0",
              marginTop: "4px",
            }}
          >
            {(["name", "time", "size"] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleSortChange(type)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 16px",
                  background: sortBy === type ? "var(--weui-BG-3)" : "transparent",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {type === "name" ? "名称" : type === "time" ? "时间" : "大小"}
              </button>
            ))}
          </div>
        )}
      </div>
      <AutoSizer renderProp={renderList} />
    </div>
  );
}
