import { Modal, Form, Input, Button, Space } from "antd";

export default function EditParticipantModal({ open, onClose, participant, onSubmit }: any) {
  const [form] = Form.useForm();

  return (
    <Modal title="Edit Participant" open={open} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={participant}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="year" label="Year" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit">Update</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      </Form>
    </Modal>
  );
}
