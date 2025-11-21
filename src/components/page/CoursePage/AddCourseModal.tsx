// src/components/pages/CoursesPage/AddCourseModal.tsx
"use client";

import React from "react";
import { Modal, Form, Input, Space } from "antd";
import Button from "@/components/ui/Button";

export default function AddCourseModal({
  open,
  onClose,
  onCreate,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: { name: string; description: string }) => void;
  loading?: boolean;
}) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Add New Course"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(vals) => {
          onCreate(vals);
          form.resetFields();
        }}
      >
        <Form.Item name="name" label="Course Name" rules={[{ required: true }]}>
          <Input placeholder="Enter course name" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea placeholder="Enter course description" rows={3} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="default" onClick={() => {
              form.resetFields();
              onClose();
            }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Course
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
