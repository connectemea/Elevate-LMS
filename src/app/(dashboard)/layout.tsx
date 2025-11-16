import { supabaseServer } from "@/lib/supabase-server";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { Layout } from "antd";
import Sidebar from "@/components/layout/Sidebar";
import HeaderBar from "@/components/layout/HeaderBar";
import { redirect } from "next/navigation";
const { Content } = Layout;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) redirect("/login?msg=401");

  return (
    <ClientLayoutWrapper>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <HeaderBar />
          <div style={{ margin: "24px 16px", padding: 24, background: "#fff", borderRadius: 8 }}>
           {children}
          </div>
        </Layout>
      </Layout>
    </ClientLayoutWrapper>
  );
}
