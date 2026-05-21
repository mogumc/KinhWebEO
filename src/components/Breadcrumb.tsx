"use client";

import React from "react";

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

export default function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  const parts = path.split("/").filter(Boolean);

  const handleClick = (index: number) => {
    const targetPath = "/" + parts.slice(0, index + 1).join("/") + "/";
    onNavigate(targetPath);
  };

  return (
    <div style={{ padding: "4px 0", display: "flex", flexWrap: "wrap", gap: "4px" }}>
      <div className="placeholder">
        <a
          href="javascript:void(0)"
          role="button"
          className="weui-btn weui-btn_mini weui-btn_primary weui-wa-hotarea"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("/");
          }}
          title="全部文件"
        >
          全部文件
        </a>
      </div>
      {parts.map((part, index) => {
        const displayPart = part.length > 7 ? part.substring(0, 7) + "..." : part;
        return (
          <div key={index} className="placeholder">
            <a
              href="javascript:void(0)"
              role="button"
              className="weui-btn weui-btn_mini weui-btn_default weui-wa-hotarea"
              onClick={(e) => {
                e.preventDefault();
                handleClick(index);
              }}
              title={part}
            >
              {displayPart}
            </a>
          </div>
        );
      })}
    </div>
  );
}
