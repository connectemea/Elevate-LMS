"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { Modal } from "antd";
import Button from "@/components/ui/Button";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabaseClient().auth.signOut();
    router.push("/login"); 
  };

  return (
    <>
      <Button
        type="danger"
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
