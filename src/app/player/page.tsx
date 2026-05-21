"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PlayerContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";
  const type = (searchParams.get("type") || "video") as "image" | "video";
  const videoRef = useRef<HTMLDivElement>(null);
  const dpRef = useRef<any>(null);

  useEffect(() => {
    if (type === "video" && videoRef.current && url) {
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
      }
    };
  }, [url, type]);

  if (!url) return <div style={{ color: "#fff", padding: "20px" }}>无效的播放地址</div>;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {type === "video" ? (
        <div ref={videoRef} style={{ width: "100%", height: "100%" }} />
      ) : (
        <img src={url} alt="预览" style={{ maxWidth: "100%", maxHeight: "100%" }} />
      )}
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense fallback={<div style={{ color: "#fff", padding: "20px" }}>加载中...</div>}>
      <PlayerContent />
    </Suspense>
  );
}
