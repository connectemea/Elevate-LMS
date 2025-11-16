"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { Card, Input, Button, Typography, Form, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";

const { Title, Text } = Typography;

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [msg, contextHolder] = message.useMessage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusMessage = searchParams.get("msg");

  const [form] = Form.useForm(); // <-- IMPORTANT

  useEffect(() => {
    supabaseClient().auth.getUser().then(({ data }) => {
      if (data.user) router.push("/courses");
      if (statusMessage === "401") msg.info("Please log in first");
    });
  }, []);

  const onFinish = async ({ email, password }: LoginFormValues) => {
    setLoading(true);

    const { error } = await supabaseClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      msg.error(error.message);
      setLoading(false);
      return;
    }

    msg.success("Login successful");
    router.push("/courses?redirect=true");
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Title level={3}>Elevate LMS</Title>

          <div className={styles.welcome}>
            <Text type="secondary">Welcome back</Text>

            <Button
              onClick={() =>
                form.setFieldsValue({
                  email: "dev@gmail.com",
                  password: "password",
                })
              }
            >
              Auto-fill Demo Credentials
            </Button>
          </div>
        </div>

        {contextHolder}

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Enter your email" }]}
          >
            <Input size="large" placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Button block type="primary" size="large" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form>

        <div className={styles.footer}>
          <Text type="secondary">© {new Date().getFullYear()} Elevate LMS</Text>
        </div>
      </Card>
    </div>
  );
}
