"use client";

import React from "react";
import { Title, Card, Button, message, Alert } from "@/components/antd";
import { SaveOutlined, SettingOutlined } from "@ant-design/icons";

export default function SettingsPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const handleSave = () => {
    messageApi.info("Eyy — there is nothing to save yet.");
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <Title level={2}>
        <SettingOutlined style={{ marginRight: 12 }} />
        System Settings
      </Title>
      {contextHolder}

      <Card>
        <Alert
          message="More Settings Coming Soon"
          description="We're working on adding more customization options for your learning platform. Advanced features will be available in the next update."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <div style={{ marginBottom: 24 }}>
          <Title level={4}>How Your Platform Works</Title>
          <div style={{ lineHeight: "1.8", color: "#666" }}>
            <p>
              🎯 <strong>Students</strong> enroll in courses and track their
              progress
            </p>
            <p>
              📚 <strong>Courses</strong> are organized into categories and
              sessions
            </p>
            <p>
              📊 <strong>Progress</strong> is manually tracked as students
              complete sessions
            </p>
            <p>
              👨‍🏫 <strong>Admin</strong> manage everything from this admin
              dashboard
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#f9f9f9",
            padding: 16,
            borderRadius: 6,
            border: "1px dashed #d9d9d9",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#999" }}>
            <strong>More settings features coming soon!</strong>
          </p>
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            size="large"
          >
            Save Current Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
