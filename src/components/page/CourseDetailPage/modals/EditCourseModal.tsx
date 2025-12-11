"use client";

import { Modal, Form, Input, Space, Button } from "antd";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  course: any;
  onUpdated: () => void;
}

export default function EditCourseModal({
  open,
  onClose,
  course,
  onUpdated,
}: Props) {
  const [form] = Form.useForm();

useEffect(() => {
  if (open && course) {
    form.setFieldsValue({
      name: course.name,
      description: course.description,
    });
  }
}, [open, course]);


  const onSubmit = async (values: any) => {
    await fetch(`/api/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    onUpdated();
    onClose();
  };

  return (
    <Modal title="Edit Course" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="name" label="Course Name" rules={[{ required: true }]}>
          <Input placeholder="Enter course name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
