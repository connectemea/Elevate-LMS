import { Card, Typography } from "antd";
import { Course } from "@/types";

const { Text, Paragraph } = Typography;

interface Props {
  course: Course;
}

export default function CourseInfo({ course }: Props) {
  return (
    <Card title="Course Information">
      <Paragraph>
        <Text strong>Description: </Text>
        {course.description || "No description provided"}
      </Paragraph>

      <Paragraph>
        <Text strong>Created: </Text>
        {new Date(course.createdAt).toLocaleDateString()}
      </Paragraph>

      <Paragraph>
        <Text strong>Last Updated: </Text>
        {new Date(course.updatedAt).toLocaleDateString()}
      </Paragraph>
    </Card>
  );
}
