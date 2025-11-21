"use client";

import { Modal, Form, Input, InputNumber, Select, Button, Space } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
  courseId: string;
  onAdded: () => void;
}

export default function AddSessionModal({
  open,
  onClose,
  courseId,
  onAdded,
}: Props) {
  const [form] = Form.useForm();

  async function handleSubmit(values: any) {
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, courseId }),
    });

    form.resetFields();
    onAdded();
    onClose();
  }

  return (
    <Modal title="Add Session" open={open} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="Session Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="assetType" label="Asset Type" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "youtube", label: "YouTube" },
              { value: "web", label: "Web" },
              { value: "pdf", label: "PDF" },
              { value: "other", label: "Other" },
            ]}
          />
        </Form.Item>

        <Form.Item name="assetLink" label="Asset Link" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="orderIndex" label="Order" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Add</Button>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
