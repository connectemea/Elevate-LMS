"use client"

import { Card,  Title, Text } from "@/components/antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import Logo from "@/assets/elevate.png";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
export default function HomePage() {
  const router = useRouter();

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
      {/* Top navigation */}
      <div
        style={{
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 50,
              height: 50,
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Image
              src={Logo}
              alt="Elevate Logo"
              width={36}
              height={36}
              style={{ objectFit: "contain", borderRadius: 8 }}
            />
          </div>
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: 600,
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            Elevate
          </Text>
        </div>

          <Button
            onClick={() => router.push('/courses')}
            type="primary"
            // size="large"
            icon={<ArrowRightOutlined />}
            style={{
              background: "rgba(255, 255, 255, 0.86)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              fontWeight: 500,
              transition: "all 0.3s ease",
            }}
            // onMouseEnter={(e) => {
            //   e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)";
            // }}
            // onMouseLeave={(e) => {
            //   e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
            // }}
          >
            Dashboard
          </Button>
      </div>

      {/* Center content */}
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
            Develop your coding skills, master DSA, and grow through{" "}
            <b>peer-to-peer learning</b>.
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
              This platform helps you <b>monitor participant progress</b>,
              manage courses, track learning milestones, and coordinate
              mentoring sessions — all in one place.
            </Text>
          </div>
        </Card>
      </div>

      {/* Footer */}
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
    </div>
  );
}
