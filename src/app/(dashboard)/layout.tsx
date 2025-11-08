"use client";

import { Layout } from "antd";
import Sidebar from "@/components/layout/Sidebar";
import HeaderBar from "@/components/layout/HeaderBar";

const { Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", borderRadius: 8 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
