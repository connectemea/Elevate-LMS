"use client";

import { useEffect, useState } from "react";

export default function FadeIn({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay to ensure initial opacity=0 renders first
    const t = setTimeout(() => setShow(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0px)" : "translateY(10px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {children}
    </div>
  );
}
