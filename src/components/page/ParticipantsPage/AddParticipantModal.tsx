"use client";

import { Modal, Form, Input, Space } from "antd";
import Button from "@/components/ui/Button";
import { UserOutlined } from "@ant-design/icons";

export default function AddParticipantModal({
  open,
  onClose,
  onCreate,
  loading,
}: any) {
  const [form] = Form.useForm();

  const submit = (values: any) => {
    onCreate(values);
    form.resetFields();
  };

  return (
    <Modal open={open} title="Add Participant" footer={null} onCancel={onClose}>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>
        <Form.Item name="year" label="Year" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      </Form>
    </Modal>
  );
}
