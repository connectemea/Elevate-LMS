import { Space, Tag, Typography } from "antd";
import { Category } from "@/types";

const { Text } = Typography;

interface Props {
  category: Category;
}

export default function CategoryItem({ category }: Props) {
  return (
    <Space>
      <Text strong>{category.name}</Text>
      <Tag>Order: {category.orderIndex}</Tag>
      <Tag>{category.sessions.length} sessions</Tag>
    </Space>
  );
}
