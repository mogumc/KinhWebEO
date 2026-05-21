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
    <nav className="flex items-center gap-1 text-sm py-3 px-4 bg-gray-50 border-b border-gray-200 flex-wrap">
      <button
        onClick={() => onNavigate("/")}
        className="text-blue-600 hover:underline cursor-pointer"
      >
        根目录
      </button>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <span className="text-gray-400">/</span>
          <button
            onClick={() => handleClick(index)}
            className="text-blue-600 hover:underline cursor-pointer max-w-[200px] truncate"
            title={part}
          >
            {part}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
