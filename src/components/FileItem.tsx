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

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <span className="text-xl flex-shrink-0 w-7 text-center">
        {getFileIcon(file.filename || file.server_filename, file.isdir)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-900 truncate">
          {file.filename || file.server_filename}
        </div>
        {file.isdir === 0 && (
          <div className="text-xs text-gray-500 mt-0.5">
            {formatBytes(file.size)}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 text-xs text-gray-400">
        {file.isdir === 1 ? "文件夹" : ""}
      </div>
    </div>
  );
}
