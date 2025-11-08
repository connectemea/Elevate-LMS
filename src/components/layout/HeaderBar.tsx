"use client";

import { Layout, Avatar, Dropdown, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function HeaderBar() {
  const menuItems = [
    { key: "profile", label: "Profile" },
    { key: "logout", label: "Logout" },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Typography.Title level={4} style={{ margin: 0 }}>
        Admin Panel
      </Typography.Title>

      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        arrow
      >
        <Avatar
          icon={<UserOutlined />}
          style={{ cursor: "pointer", backgroundColor: "#1677ff" }}
        />
      </Dropdown>
    </Header>
  );
}
