"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 初始化主题：读取 localStorage，否则读取系统偏好
    const savedTheme = localStorage.getItem("isDark");
    const isDarkMode = savedTheme !== null 
      ? savedTheme === "true" 
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("isDark", String(newTheme));
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
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--weui-BG-2)",
        borderRadius: "50%",
        cursor: "pointer",
        boxShadow: "var(--shadow)",
        border: "1px solid var(--weui-FG-3)",
      }}
    >
      <div style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: "var(--weui-FG-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--weui-BG-0)"
      }}>
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </div>
    </div>
  );
}
