"use client";

import { Layout, Menu, Button } from "antd";
import Logo from "@/assets/elevate.png";
import Image from "next/image";
import {
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { key: "/courses", icon: <BookOutlined />, label: <Link href="/courses">Courses</Link> },
    { key: "/users", icon: <UserOutlined />, label: <Link href="/users">Users</Link> },
    { key: "/settings", icon: <SettingOutlined />, label: <Link href="/settings">Settings</Link> },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={null}
      width={220}
      style={{ 
        background: "#001529",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header with Logo and Toggle */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "0" : "0 16px",
          color: "white",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          <Image
            src={Logo}
            alt="Elevate Logo"
            width={32}
            height={32}
            style={{ objectFit: "contain", borderRadius: 8 }}
          />
          {!collapsed && <span>Elevate LMS</span>}
        </div>
        
        {!collapsed && (
          <Button
            type="text"
            icon={<MenuFoldOutlined />}
            onClick={() => setCollapsed(true)}
            style={{
              color: "white",
              fontSize: 16,
            }}
          />
        )}
      </div>

      {/* Collapsed toggle button */}
      {collapsed && (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <Button
            type="text"
            icon={<MenuUnfoldOutlined />}
            onClick={() => setCollapsed(false)}
            style={{
              color: "white",
              fontSize: 16,
            }}
          />
        </div>
      )}

      {/* Menu */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </div>

      {/* Footer with Logout */}
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          padding: collapsed ? "16px 0" : "16px",
        }}
      >
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={() => {
            // Add your logout logic here
            router.push("/");
            console.log("Logout clicked");
          }}
          style={{
            width: "100%",
            color: "#ff4d4f",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 8,
            fontWeight: 500,
          }}
        >
          {!collapsed && "Logout"}
        </Button>
      </div>
    </Sider>
  );
}