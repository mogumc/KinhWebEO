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
    <div style={{ padding: "4px 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px", fontSize: "14px" }}>
      <a
        href="javascript:void(0)"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("/");
        }}
        style={{ color: "var(--weui-LINK)", textDecoration: "none" }}
      >
        全部文件
      </a>
      {parts.map((part, index) => {
        return (
          <React.Fragment key={index}>
            <span>/</span>
            <a
              href="javascript:void(0)"
              onClick={(e) => {
                e.preventDefault();
                handleClick(index);
              }}
              style={{ color: "var(--weui-LINK)", textDecoration: "none" }}
            >
              {part}
            </a>
          </React.Fragment>
        );
      })}
    </div>
  );
}
