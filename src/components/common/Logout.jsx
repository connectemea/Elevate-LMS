"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Button, Modal } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); 
  };

  return (
    <>
      <Button
        danger
        icon={<LogoutOutlined />}
        onClick={() => setOpen(true)}
      >
        Logout
      </Button>

      <Modal
        title="Confirm Logout"
        open={open}
        onOk={handleLogout}
        onCancel={() => setOpen(false)}
        okText="Logout"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </>
  );
}
