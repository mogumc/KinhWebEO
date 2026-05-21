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
      <div className="flex items-center justify-center py-12 text-gray-500">
        加载中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-red-500">
        {error}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        空目录
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {files.map((file) => (
        <FileItem key={file.fs_id} file={file} onOpen={onOpen} />
      ))}
    </div>
  );
}
