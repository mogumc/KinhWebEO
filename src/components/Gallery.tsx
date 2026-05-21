"use client";

import React, { useEffect, useRef } from "react";

interface GalleryProps {
  open: boolean;
  url: string;
  type: "image" | "video";
  filename: string;
  onClose: () => void;
}

export default function Gallery({ open, url, type, filename, onClose }: GalleryProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [open, url]);

  if (!open) return null;

  return (
    <div className="weui-gallery">
      {type === "image" && (
        <div
          className="weui-gallery__img"
          style={{ backgroundImage: `url(${url})` }}
        />
      )}
      {type === "video" && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
          <video
            ref={videoRef}
            src={url}
            controls
            autoPlay
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          >
            您的浏览器不支持视频播放
          </video>
        </div>
      )}
      <div className="weui-gallery__opr">
        <div className="weui-gallery__delete" onClick={onClose}>
          关闭
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="weui-gallery__delete"
          style={{ color: "#fff" }}
        >
          在新窗口打开
        </a>
      </div>
    </div>
  );
}
