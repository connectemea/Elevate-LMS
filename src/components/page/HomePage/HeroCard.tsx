"use client";

import React from "react";
import { Card, Title, Text } from "@/components/antd";

export default function HeroCard() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: 520,
          textAlign: "center",
          padding: 40,
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
        }}
      >
        <Title level={1} style={{ marginBottom: 16, color: "#667eea" }}>
          Free Mentoring
        </Title>
        <Text
          style={{
            color: "#666",
            lineHeight: 1.8,
            fontSize: 16,
            display: "block",
            marginBottom: 24,
          }}
        >
          Connect EMEA Elevate Program is an <b>invite-only</b> mentoring
          initiative for students.
          <br />
          <br />
          Develop your coding skills, master DSA, and grow through <b>peer-to-peer
          learning</b>.
        </Text>

        <div
          style={{
            background: "linear-gradient(135deg, #f8f9ff 0%, #f0f0ff 100%)",
            padding: 24,
            borderRadius: 12,
            border: "1px solid #e0e0ff",
          }}
        >
          <Title level={4} style={{ marginBottom: 12, color: "#667eea" }}>
            Platform Features
          </Title>
          <Text
            style={{
              color: "#555",
              lineHeight: 1.7,
              fontSize: 15,
              display: "block",
            }}
          >
            This platform helps you <b>monitor participant progress</b>, manage
            courses, track learning milestones, and coordinate mentoring
            sessions — all in one place.
          </Text>
        </div>
      </Card>
    </div>
  );
}
