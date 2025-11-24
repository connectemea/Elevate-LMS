"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "default" | "primary" | "danger" | "link"; // AntD-like API
  htmlType?: "button" | "submit" | "reset"; // form support
  className?: string;
  size?: "small" | "middle" | "large";
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  loading?: boolean;
  href?: string;
  target?: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button({
  children,
  onClick,
  disabled,
  type = "default",
  size = "middle",
  htmlType = "button",
  className = "",
  loading = false,
  style = {},
  icon,
  href,
  target,
  onMouseEnter,
  onMouseLeave,
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
    link: {
      background: "none",
      color: "#1677ff",
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
      {href ? (
        <a
          href={href}
          target={target}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              {icon}
              {children}
            </>
          )}
        </a>
      ) : (
        <>
          {loading ? (
            "Loading..."
          ) : (
            <>
              {icon}
              {children}
            </>
          )}
        </>
      )}
    </button>
  );
}
