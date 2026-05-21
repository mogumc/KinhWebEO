"use client";

import React, { useEffect, useRef } from "react";

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
      className="rounded-lg shadow-lg p-0 max-w-md w-full border border-gray-200"
      onClose={onClose}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">下载文件</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">文件名</div>
          <div className="text-sm text-gray-900 break-all">{filename}</div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">下载链接</div>
          <div className="bg-gray-50 rounded p-3">
            <a
              href={dlink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 break-all hover:underline"
            >
              {dlink}
            </a>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href={dlink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            直接下载
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(dlink);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
          >
            复制链接
          </button>
        </div>
      </div>
    </dialog>
  );
}
