"use client";

import React, { useEffect, useRef, useState } from "react";

interface DownloadDialogProps {
  open: boolean;
  dlink: string;
  filename: string;
  onClose: () => void;
}

export default function DownloadDialog({
  open,
  dlink,
  filename,
  onClose,
}: DownloadDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(dlink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="rounded-2xl overflow-hidden max-w-md w-full animate-slideUp"
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
          background: "var(--accent-gradient)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">下载文件</h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Filename */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
            文件名
          </label>
          <div
            className="px-4 py-3 rounded-xl text-sm font-medium break-all"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
            }}
          >
            {filename}
          </div>
        </div>

        {/* Link */}
        <div className="mb-6">
          <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
            下载链接
          </label>
          <div
            className="px-4 py-3 rounded-xl text-xs break-all"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--accent)",
              maxHeight: "80px",
              overflowY: "auto",
            }}
          >
            {dlink}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href={dlink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--accent-gradient)",
              boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.4)",
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            直接下载
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" style={{ color: "var(--success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                已复制
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                复制链接
              </>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}
