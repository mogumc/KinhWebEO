"use client";

import React, { useEffect, useRef } from "react";

interface PlayerProps {
  open: boolean;
  url: string;
  filename: string;
  type: "video" | "audio" | "image";
  onClose: () => void;
}

export default function Player({ open, url, filename, type, onClose }: PlayerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg shadow-lg p-0 max-w-4xl w-full border border-gray-200"
      onClose={onClose}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 truncate max-w-[80%]">
            {filename}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
          >
            &times;
          </button>
        </div>

        <div className="flex items-center justify-center bg-black rounded">
          {type === "video" && (
            <video
              src={url}
              controls
              className="max-h-[70vh] max-w-full"
              autoPlay
            >
              您的浏览器不支持视频播放
            </video>
          )}
          {type === "audio" && (
            <audio src={url} controls className="w-full" autoPlay>
              您的浏览器不支持音频播放
            </audio>
          )}
          {type === "image" && (
            <img
              src={url}
              alt={filename}
              className="max-h-[70vh] max-w-full object-contain"
            />
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            在新窗口打开
          </a>
        </div>
      </div>
    </dialog>
  );
}
