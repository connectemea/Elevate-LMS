import { Table, Button, Space, Tag, Progress } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function EnrollmentTable({ enrollments, participantId, onUnenroll, onOpenEnroll }: any) {
  const router = useRouter();

  const columns = [
    {
      title: "Course",
      dataIndex: "courseName",
      render: (name: string) => <strong>{name}</strong>,
    },
    {
      title: "Progress",
      dataIndex: "progress",
      render: (progress: number) => (
        <Space style={{ width: "100%" }}>
          <Progress percent={Math.round(progress)} size="small" style={{ flex: 1 }} />
          {Math.round(progress)}%
        </Space>
      ),
    },
    {
      title: "Status",
      render: (_: any, r: any) => (
        <Tag color={r.progress === 100 ? "green" : r.progress > 0 ? "blue" : "default"}>
          {r.progress === 100 ? "Completed" : r.progress > 0 ? "In Progress" : "Not Started"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_: any, r: any) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(`/participants/${participantId}/course/${r.courseId}`)
            }
          >
            View
          </Button>

          <Button danger type="link" size="small" onClick={() => onUnenroll(r.id)}>
            Unenroll
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      title={() => (
        <Button type="dashed" onClick={onOpenEnroll}>Enroll in Course</Button>
      )}
      dataSource={enrollments}
      columns={columns}
      pagination={false}
      rowKey="id"
    />
  );
}
