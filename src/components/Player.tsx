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
      className="rounded-2xl overflow-hidden max-w-4xl w-full animate-slideUp"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-xl)",
      }}
      onClose={onClose}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{
          background: "var(--bg-tertiary)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: type === "video"
                ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                : type === "audio"
                ? "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            {type === "video" && (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {type === "audio" && (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            )}
            {type === "image" && (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <h3
            className="text-sm font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {filename}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Player Content */}
      <div className="p-4">
        <div
          className="rounded-xl overflow-hidden flex items-center justify-center"
          style={{ background: "#000" }}
        >
          {type === "video" && (
            <video
              src={url}
              controls
              className="max-h-[70vh] w-full"
              autoPlay
            >
              您的浏览器不支持视频播放
            </video>
          )}
          {type === "audio" && (
            <div className="w-full p-8">
              <audio src={url} controls className="w-full" autoPlay>
                您的浏览器不支持音频播放
              </audio>
            </div>
          )}
          {type === "image" && (
            <img
              src={url}
              alt={filename}
              className="max-h-[70vh] w-full object-contain"
            />
          )}
        </div>

        {/* Footer Action */}
        <div className="mt-4 flex justify-end">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--accent-gradient)",
              color: "white",
              boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.3)",
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            在新窗口打开
          </a>
        </div>
      </div>
    </dialog>
  );
}
