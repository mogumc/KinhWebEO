"use client";

import React from "react";
import { FileEntry } from "@/lib/api";
import { formatBytes, getFileIcon, getFileCategory } from "@/lib/utils";

interface FileListProps {
  files: FileEntry[];
  loading: boolean;
  onOpen: (file: FileEntry) => void;
}

export default function FileList({ files, loading, onOpen }: FileListProps) {
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

  return (
    <div>
      {files.map((file, index) => {
        const cat = file.isdir === 1 ? "folder" : getFileCategory(file.category);
        const icon = getFileIcon(file.server_filename, file.isdir);
        const iconClass = `icon-${cat}`;

        return (
          <div
            key={file.fs_id}
            className="animate-fadeIn"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <a
              href="javascript:void(0)"
              className="weui-media-box weui-media-box_appmsg"
              onClick={(e) => {
                e.preventDefault();
                onOpen(file);
              }}
              style={{ cursor: "pointer" }}
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
                {file.isdir === 1 ? "›" : "›"}
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
}
