import { Table, Tag } from "antd";

export default function SessionProgressTable({ progress }: any) {
  const columns = [
    { title: "Session", dataIndex: "sessionTitle" },
    { title: "Course", dataIndex: "courseName" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => (
        <Tag color={s === "completed" ? "green" : "blue"}>
          {s.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      render: (d: string) => new Date(d).toLocaleDateString(),
    },
  ];

  return (
    <Table
      dataSource={progress}
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  );
}
