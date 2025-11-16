"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "default" | "primary" | "danger"; // AntD-like API
  htmlType?: "button" | "submit" | "reset"; // form support
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
};

export default function Button({
  children,
  onClick,
  disabled,
  type = "default",
  htmlType = "button",
  className = "",
  style = {},
  icon,
}: ButtonProps) {
  const colors = {
    primary: {
      background: "#51258f",
      color: "#fff",
    },
    danger: {
      background: "#ff4d4f",
      color: "#fff",
    },
    default: {
      background: "#1677ff",
      color: "#fff",
    },
  };

  return (
    <button
      type={htmlType}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{
        padding: "8px 14px",
        borderRadius: 6,
        border: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontWeight: 500,
        transition: "0.2s",
        ...colors[type],
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}
