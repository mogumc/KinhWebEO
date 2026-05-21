"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

  const btnStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.3)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "14px",
    opacity: showOpr ? 1 : 0,
    transition: "opacity 0.3s",
    zIndex: 6001,
  };

  return (
    <div className="weui-gallery" onMouseEnter={() => setShowOpr(true)} onMouseLeave={() => setShowOpr(false)}>
      {type === "image" && (
        <div
          className="weui-gallery__img"
          style={{ backgroundImage: `url(${url})` }}
        />
      )}
      {type === "video" && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
          <div ref={videoRef} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      
      <div style={{ ...btnStyle, left: "10px" }} onClick={onClose}>关</div>
      <div style={{ ...btnStyle, right: "10px" }} onClick={handleOpenNewWindow}>开</div>
    </div>
  );
}
