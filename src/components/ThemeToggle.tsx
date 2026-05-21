"use client";

import React, { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 初始化主题
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div
      onClick={toggleTheme}
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 9999,
        padding: "8px 12px",
        background: "var(--weui-BG-2)",
        borderRadius: "20px",
        cursor: "pointer",
        fontSize: "14px",
        boxShadow: "var(--shadow)",
        border: "1px solid var(--weui-FG-3)",
      }}
    >
      {isDark ? "🌞" : "🌙"}
    </div>
  );
}
