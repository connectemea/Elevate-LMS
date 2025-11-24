import { Table, Space, Typography, Button } from "antd";
import { UserOutlined, EyeOutlined } from "@ant-design/icons";
import { Enrollment } from "@/types";
import { useRouter } from "next/navigation";

const { Text } = Typography;

interface Props {
  enrollments: Enrollment[];
}

export default function EnrollmentTable({ enrollments }: Props) {
  const router = useRouter();

  const columns = [
    {
      title: "Student",
      dataIndex: ["user", "name"],
      key: "student",
      render: (name: string, record: Enrollment) => (
        <Space>
          <UserOutlined />
          <div>
            <div>{name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.user.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => (
        <Space>
          <div style={{ width: 100 }}>
            <div
              style={{
                width: `${progress}%`,
                height: 8,
                backgroundColor: "#1890ff",
                borderRadius: 4,
              }}
            />
          </div>
          <Text strong>{progress}%</Text>
        </Space>
      ),
      sorter: (a: Enrollment, b: Enrollment) => a.progress - b.progress,
    },
    {
      title: "Sessions",
      dataIndex: "completedSessions",
      key: "sessions",
      render: (c: number, r: Enrollment) => (
        <Text>
          {c} / {r.totalSessions}
        </Text>
      ),
      sorter: (a: Enrollment, b: Enrollment) =>
        a.completedSessions - b.completedSessions,
    },
    {
      title: "Enrolled Date",
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Enrollment) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() =>
            router.push(`/participants/${record.user.id}/course/${record.courseId}`)
          }
        >
          View Participant
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={enrollments}
      pagination={{ pageSize: 10 }}
      locale={{ emptyText: "No enrollments yet" }}
     rowKey={record => record.user.id}
    />
  );
}
