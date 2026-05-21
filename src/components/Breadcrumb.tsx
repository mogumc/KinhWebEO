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
    <nav
      className="flex items-center gap-1 text-sm px-4 py-3 rounded-xl flex-wrap"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <button
        onClick={() => onNavigate("/")}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105 cursor-pointer"
        style={{
          color: "var(--accent)",
          background: "var(--accent-light)",
        }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        根目录
      </button>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <svg
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <button
            onClick={() => handleClick(index)}
            className="px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105 cursor-pointer max-w-[180px] truncate"
            style={{
              color: index === parts.length - 1 ? "var(--text-primary)" : "var(--accent)",
              background: index === parts.length - 1 ? "var(--bg-tertiary)" : "transparent",
            }}
            title={part}
          >
            {part}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
