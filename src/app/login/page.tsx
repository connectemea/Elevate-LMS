"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { Card, Input, Button, Typography, Form, message } from "antd";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const searchParams = useSearchParams();
  const statusMessage = searchParams.get("msg");
  const router = useRouter();

  useEffect(() => {
    if (statusMessage === "401") {
      messageApi.info("Please log in to access this page.");
    }
  }, [statusMessage]);

  const onFinish = async (values: any) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      messageApi.error(error.message);
      setLoading(false);
      return;
    }

    messageApi.success("Login successful");
    router.push("/courses");
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 380,
          borderRadius: 10,
          boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Title level={3} style={{ marginBottom: 5 }}>
            Elevate LMS
          </Title>
          <Text type="secondary">Sign in to continue</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input size="large" placeholder="example@mail.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password size="large" placeholder="Your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginTop: 10 }}
        >
          © {new Date().getFullYear()} Elevate LMS
        </Text>
      </Card>

      {contextHolder}
    </div>
  );
}
