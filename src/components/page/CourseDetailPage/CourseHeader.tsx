"use client";

import { Button, Space } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { Title } from "@/components/antd";

type Props = {
  name: string;
  onBack: () => void;
  onEdit: () => void;
};

export default function CourseHeader({ name, onBack, onEdit }: Props) {
  return (
    <Space
      style={{
        width: "100%",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
        Back
      </Button>

      <Title level={2} style={{ margin: 0 }}>
        {name}
      </Title>

      <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
        Edit Course
      </Button>
    </Space>
  );
}
