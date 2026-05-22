"use client";

import React from "react";

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

export default function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  const parts = path.split("/").filter(Boolean);
  const isRoot = parts.length === 0;

  if (isRoot) {
    return (
      <div style={{ padding: "4px 0", fontSize: "14px", color: "var(--weui-FG-2)" }}>
        <span style={{ cursor: "default" }}>全部文件</span>
      </div>
    );
  }

  return (
    <div style={{ padding: "4px 0", display: "flex", flexWrap: "wrap", alignItems: "center", fontSize: "14px" }}>
      {/* 返回上一级 */}
      <span
        style={{ cursor: "pointer", color: "var(--weui-LINK)" }}
        onClick={() => onNavigate(parts.length > 1 ? "/" + parts.slice(0, -1).join("/") + "/" : "/")}
      >
        <span>返回上一级</span>
        <span style={{ margin: "0 8px", color: "var(--weui-FG-2)" }}>|</span>
      </span>

      {/* 全部文件 (根) */}
      <span
        style={{ cursor: "pointer", color: "var(--weui-LINK)" }}
        onClick={() => onNavigate("/")}
      >
        <span>全部文件</span>
        <span style={{ margin: "0 8px", color: "var(--weui-FG-2)" }}>&gt;</span>
      </span>

      {/* 当前路径部分 */}
      {parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        const currentPath = "/" + parts.slice(0, index + 1).join("/") + "/";
        
        return (
          <span
            key={index}
            style={{
              color: isLast ? "var(--weui-FG-2)" : "var(--weui-LINK)",
              cursor: isLast ? "default" : "pointer"
            }}
          >
            <span onClick={!isLast ? () => onNavigate(currentPath) : undefined}>
              {part}
            </span>
            {!isLast && <span style={{ margin: "0 8px", color: "var(--weui-FG-2)" }}>&gt;</span>}
          </span>
        );
      })}
    </div>
  );
}
