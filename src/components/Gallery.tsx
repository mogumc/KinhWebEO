"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ExternalLink } from "lucide-react";

interface GalleryProps {
  open: boolean;
  url: string;
  type: "image" | "video";
  filename: string;
  onClose: () => void;
}

export default function Gallery({ open, url, type, filename, onClose }: GalleryProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLDivElement>(null);
  const dpRef = useRef<any>(null);
  const [showOpr, setShowOpr] = useState(false);

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
    if (open && type === "video" && videoRef.current && url) {
      if (dpRef.current) {
        dpRef.current.destroy();
        dpRef.current = null;
      }

      import("dplayer").then(({ default: DPlayer }) => {
        if (!videoRef.current) return;
        dpRef.current = new DPlayer({
          container: videoRef.current,
          autoplay: true,
          video: {
            url: url,
            type: "auto",
          },
        });
      });
    }

    return () => {
      if (dpRef.current) {
        dpRef.current.destroy();
        dpRef.current = null;
      }
    };
  }, [open, url, type]);

  const handleOpenNewWindow = () => {
    const playerUrl = `/player?url=${encodeURIComponent(url)}&type=${type}`;
    window.open(playerUrl, "_blank");
    onClose();
  };

  if (!open) return null;

  // 修改后的返回界面逻辑
  return (
    <div className="weui-gallery" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)" }}>
      <div 
        style={{ 
          width: "90vw", 
          height: "80vh", 
          position: "relative", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "#000",
          borderRadius: "8px",
          overflow: "hidden"
        }}
      >
        {type === "image" && (
          <img src={url} alt={filename} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        )}
        {type === "video" && (
          <div ref={videoRef} style={{ width: "100%", height: "100%" }} />
        )}

        <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "10px" }}>
          <div 
            style={{ ...btnStyle, position: "static", transform: "none", opacity: 1, background: "rgba(255,255,255,0.2)" }} 
            onClick={handleOpenNewWindow}
            title="在新窗口打开"
          >
            <ExternalLink size={20} />
          </div>
          <div 
            style={{ ...btnStyle, position: "static", transform: "none", opacity: 1, background: "rgba(255,255,255,0.2)" }} 
            onClick={onClose}
            title="关闭"
          >
            <X size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
