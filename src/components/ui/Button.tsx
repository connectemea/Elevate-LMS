"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "default" | "primary" | "danger"; // AntD-like API
  htmlType?: "button" | "submit" | "reset"; // form support
  className?: string;
  size?: "small" | "middle" | "large"; 
  style?: React.CSSProperties;
  icon?: React.ReactNode;
};

export default function Button({
  children,
  onClick,
  disabled,
  type = "default",
   size = "middle",
  htmlType = "button",
  className = "",
  
  style = {},
  icon,
}: ButtonProps) {
  const colors = {
    primary: {
      background: "#1677ff",
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
  const sizes = {
  small: {
    padding: "4px 10px",
    fontSize: "12px",
  },
  middle: {
    padding: "8px 14px",
    fontSize: "14px",
  },
  large: {
    padding: "12px 18px",
    fontSize: "16px",
  },
};


  return (
    <button
      type={htmlType}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{
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
        ...sizes[size], 
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}
