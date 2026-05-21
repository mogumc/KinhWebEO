"use client";

import React, { useEffect, useRef, useState } from "react";
import DPlayer from "dplayer";

interface GalleryProps {
  open: boolean;
  url: string;
  type: "image" | "video";
  filename: string;
  onClose: () => void;
}

export default function Gallery({ open, url, type, filename, onClose }: GalleryProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const dpRef = useRef<DPlayer | null>(null);
  const [imgSrc, setImgSrc] = useState("");

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

  // 图片预览：通过 fetch 获取 blob URL，隐藏 Referer
  useEffect(() => {
    if (open && type === "image" && url) {
      fetch(url, { headers: { Referer: "" } })
        .then((res) => res.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          setImgSrc(blobUrl);
        })
        .catch(() => {
          setImgSrc(url);
        });
    }

    return () => {
      if (imgSrc && imgSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [open, url, type]);

  // 视频预览：DPlayer
  useEffect(() => {
    if (open && type === "video" && videoRef.current && url) {
      if (dpRef.current) {
        dpRef.current.destroy();
        dpRef.current = null;
      }

      dpRef.current = new DPlayer({
        container: videoRef.current,
        autoplay: true,
        video: {
          url: url,
          type: "auto",
        },
      });
    }

    return () => {
      if (dpRef.current) {
        dpRef.current.destroy();
        dpRef.current = null;
      }
    };
  }, [open, url, type]);

  if (!open) return null;

  return (
    <div className="weui-gallery">
      {type === "image" && imgSrc && (
        <div
          className="weui-gallery__img"
          style={{ backgroundImage: `url(${imgSrc})` }}
        />
      )}
      {type === "video" && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
          <div ref={videoRef} style={{ width: "100%", height: "100%" }} />
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
