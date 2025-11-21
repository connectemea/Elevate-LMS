"use client";

import React from "react";
import Header from "./Header";
import HeroCard from "./HeroCard";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Header />
      <HeroCard />
      <Footer />
    </div>
  );
}
