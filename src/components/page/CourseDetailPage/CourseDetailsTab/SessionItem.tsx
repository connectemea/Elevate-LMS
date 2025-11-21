import { List, Space, Button, Tag, Typography } from "antd";
import {
  EyeOutlined,
  PlayCircleOutlined,
  LinkOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Session } from "@/types";

const { Text } = Typography;

interface Props {
  session: Session;
  categoryId: string;
  onEdit: (categoryId: string, sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}

const ICONS = {
  youtube: <PlayCircleOutlined style={{ color: "#ff4d4f" }} />,
  web: <LinkOutlined style={{ color: "#1890ff" }} />,
  pdf: <FileTextOutlined style={{ color: "#52c41a" }} />,
  other: <EyeOutlined />,
};

export default function SessionItem({
  session,
  categoryId,
  onEdit,
  onDelete,
}: Props) {
  return (
    <List.Item
      actions={[
        <Button type="link" href={session.assetLink} target="_blank" icon={<EyeOutlined />}>
          View
        </Button>,
        <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(categoryId, session.id)}>
          Edit
        </Button>,
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(session.id)}>
          Delete
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={ICONS[session.assetType]}
        title={
          <Space>
            <Text>{session.title}</Text>
            <Tag>{session.assetType.toUpperCase()}</Tag>
            <Tag>Order: {session.orderIndex}</Tag>
          </Space>
        }
        description={session.assetLink}
      />
    </List.Item>
  );
}
