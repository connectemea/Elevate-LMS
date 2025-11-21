"use client";

import React from "react";
import { Text } from "@/components/antd";
import Logo from "@/assets/elevate.png";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <div
      style={{
        padding: "24px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
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
        onClick={() => router.push("/courses")}
        type="primary"
        icon={<ArrowRightOutlined />}
        style={{
          border: "1px solid rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(10px)",
          color: "#fff",
          fontWeight: 500,
          transition: "all 0.3s ease",
        }}
      >
        Dashboard
      </Button>
    </div>
  );
}
