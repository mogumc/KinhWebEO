"use client";

import React, { useEffect } from "react";

interface ActionSheetProps {
  open: boolean;
  filename: string;
  isVideo: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  onDownload: () => void;
  onPreview: () => void;
}

export default function ActionSheet({
  open,
  filename,
  isVideo,
  onClose,
  onCopyLink,
  onDownload,
  onPreview,
}: ActionSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mask */}
      <div
        className={`weui-mask ${open ? "show" : ""}`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={`weui-actionsheet ${open ? "show" : ""}`}>
        <div className="weui-actionsheet__title">{filename}</div>
        <div className="weui-actionsheet__cell" onClick={onCopyLink}>
          复制下载链接
        </div>
        <div className="weui-actionsheet__cell" onClick={onDownload}>
          直接下载
        </div>
        {(isVideo) && (
          <div className="weui-actionsheet__cell" onClick={onPreview}>
            预览文件
          </div>
        )}
        {!isVideo && (
          <div className="weui-actionsheet__cell" onClick={onPreview}>
            预览文件
          </div>
        )}
        <div
          className="weui-actionsheet__cell weui-actionsheet__cell--cancel"
          onClick={onClose}
        >
          取消
        </div>
      </div>
    </>
  );
}
