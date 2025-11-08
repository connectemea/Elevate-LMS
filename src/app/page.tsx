"use client";

import { Card, Typography, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 420,
          textAlign: "center",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={2} style={{ marginBottom: 12 }}>
          Elevate LMS
        </Title>

        <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
          Admin Dashboard powered by Next.js + Ant Design + Prisma
        </Text>

        <Link href="/dashboard">
          <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
            Go to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
}
