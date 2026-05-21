"use client";

import React from "react";

interface ToastProps {
  show: boolean;
  text: string;
  type?: "error" | "loading";
}

export default function Toast({ show, text, type = "error" }: ToastProps) {
  return (
    <div className={`weui-toast ${show ? "show" : ""}`}>
      {type === "loading" && <div className="weui-loading" />}
      <div>{text}</div>
    </div>
  );
}
