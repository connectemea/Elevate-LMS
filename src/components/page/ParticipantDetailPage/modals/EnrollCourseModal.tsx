import { Modal, Form, Select, Button, Space } from "antd";

export default function EnrollCourseModal({ open, onClose, courses, onSubmit }: any) {
  const [form] = Form.useForm();

  return (
    <Modal title="Enroll in Course" open={open} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="courseId" label="Course" rules={[{ required: true }]}>
          <Select options={courses.map((c: any) => ({ label: c.name, value: c.id }))} />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit">Enroll</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      </Form>
    </Modal>
  );
}
