"use client";

import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        userSelect: "none",
        margin: "20px 60px",
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        borderRadius: 12,
        border: "1px solid rgba(255, 255, 255, 0.3)",
        padding: "16px 20px",
        textAlign: "center",
        color: "#fff",
        fontSize: 14,
      }}
    >
      © 2025 Connect EMEA · All rights reserved.
    </footer>
  );
}
