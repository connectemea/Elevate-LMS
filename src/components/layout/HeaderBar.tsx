"use client";

import { Layout, Avatar, Dropdown, Typography } from "antd";
import LogoutButton from "@/components/common/Logout";
import {
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Header } = Layout;

export default function HeaderBar() {
  const router = useRouter();

  const handleLogout = () => {
    // Example: Clear tokens, session, or local storage if needed
    localStorage.removeItem("token");
    sessionStorage.clear();

    // Redirect to home or login page
    router.push("/");
  };

  const menuItems = [
    { key: "profile", label: "Profile" },
    { type: "divider" as const },
    { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") handleLogout();
    if (key === "profile") console.log("Profile clicked");
  };

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

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          danger
        >
          Logout
        </Button> */}
        <LogoutButton />

        <Dropdown
          menu={{ items: menuItems, onClick: handleMenuClick }}
          placement="bottomRight"
          arrow
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: "8px",
            }}
          >
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#51258f" }}
            />
            <DownOutlined style={{ fontSize: "12px", color: "#555" }} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
