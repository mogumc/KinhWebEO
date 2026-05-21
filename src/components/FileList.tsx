"use client";

import React from "react";
import { FileEntry } from "@/lib/api";
import FileItem from "./FileItem";

interface FileListProps {
  files: FileEntry[];
  loading: boolean;
  error: string | null;
  onOpen: (path: string, isdir: number) => void;
}

export default function FileList({ files, loading, error, onOpen }: FileListProps) {
  if (loading) {
    return (
      <div
        className="rounded-2xl p-8"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
            />
          </div>
          <div className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            正在加载文件列表...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl p-8"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--danger)",
        }}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "#fef2f2" }}
          >
            <svg className="w-6 h-6" style={{ color: "var(--danger)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium" style={{ color: "var(--danger)" }}>
              加载失败
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div
        className="rounded-2xl p-12"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "var(--bg-tertiary)" }}
          >
            📂
          </div>
          <div className="text-center">
            <div className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              空目录
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              此目录下没有任何文件
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-2"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex flex-col gap-1">
        {files.map((file, index) => (
          <div
            key={file.fs_id}
            className="animate-fadeIn"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <FileItem file={file} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </div>
  );
}
