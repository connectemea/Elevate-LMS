"use client";

import { Modal, Form, Input, InputNumber, Button, Space, message } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
  courseId: string;
  onAdded: () => void;
}

export default function AddCategoryModal({
  open,
  onClose,
  courseId,
  onAdded,
}: Props) {
  const [form] = Form.useForm();

  const onSubmit = async (values: any) => {
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, courseId }),
    });

    message.success("Category added");
    onAdded();
    onClose();
    form.resetFields();
  };

  return (
    <Modal title="Add New Category" open={open} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item
          name="orderIndex"
          label="Order Index"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Add Category
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
