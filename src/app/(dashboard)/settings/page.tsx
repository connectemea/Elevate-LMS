"use client";

import { Title, Card, Form, Input, Button, message } from "@/components/antd";

export default function SettingsPage() {
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success("Settings saved successfully!");
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Settings</Title>
      <Card style={{ maxWidth: 500, marginTop: 24 }}>
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            label="Site Name"
            name="siteName"
            rules={[{ required: true, message: "Please enter a site name" }]}
          >
            <Input placeholder="Enter site name" />
          </Form.Item>

          <Form.Item
            label="Admin Email"
            name="adminEmail"
            rules={[{ type: "email", message: "Enter a valid email" }]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
