"use client";

import { Layout, Menu } from "antd";
import Logo from "@/assets/elevate.png";
import Image from "next/image";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const items = [
    // { key: "/", icon: <DashboardOutlined />, label: <Link href="/">Dashboard</Link> },
    { key: "/courses", icon: <BookOutlined />, label: <Link href="/courses">Courses</Link> },
    { key: "/users", icon: <UserOutlined />, label: <Link href="/users">Users</Link> },
    { key: "/settings", icon: <SettingOutlined />, label: <Link href="/settings">Settings</Link> },
    { key: "/logout", icon: <LogoutOutlined />, label: <Link href="/">Logout</Link> },
    // { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={220}
      style={{ background: "#24163a" }}
    >
      <div
        style={{
          height: 64,
          margin: 16,
          textAlign: "center",
          color: "white",
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        
             {collapsed ?  <Image
              src={Logo}
              alt="Elevate Logo"
              width={32}
              height={32}
              style={{ objectFit: "contain", borderRadius: 8 }}
            /> : "Elevate LMS"}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={items}
        style={{ background: "#24163a", borderRight: 0 }}
      />


    </Sider>
  );
}
