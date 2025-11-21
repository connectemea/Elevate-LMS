// src/components/pages/CoursesPage/CourseTable.tsx
"use client";

import React from "react";
import { Table, Tag, Space } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface Course {
  id: string;
  name: string;
  description?: string | null;
  _count?: { enrollments?: number };
  categories?: any[];
}

export default function CourseTable({
  courses,
  loading,
  onDelete,
}: {
  courses: Course[];
  loading?: boolean;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    { title: "Course Name", dataIndex: "name", key: "name", render: (n: string) => <strong>{n}</strong> },
    { title: "Description", dataIndex: "description", key: "description", ellipsis: true, render: (d: any) => d || "No description" },
    {
      title: "Enrolled",
      dataIndex: ["_count", "enrollments"],
      key: "enrollments",
      align: "center" as const,
      render: (enrolled: number) => <Tag color="blue">{enrolled || 0} students</Tag>,
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      align: "center" as const,
      render: (categories: any[] = []) => <Tag>{categories.length} categories</Tag>,
    },
    { title: "Status", key: "status", align: "center" as const, render: () => <Tag color="green">Active</Tag> },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: Course) => (
        <Space direction="vertical" size="small" style={{ width: "100%", justifyContent: "center" }}>
          <Button type="primary" onClick={() => router.push(`/courses/${record.id}`)}>
            <EyeOutlined /> View Details
          </Button>
          <Button type="danger" onClick={() => onDelete(record.id)}>
            <DeleteOutlined /> Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      style={{ minWidth: 700 }}
      columns={columns}
      dataSource={courses.map((c) => ({ key: c.id, ...c }))}
      pagination={{
        current: currentPage,
        pageSize,
        pageSizeOptions: ["10", "20", "50"],
        showSizeChanger: true,
        onChange: (page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        },
      }}
      bordered
      loading={loading}
      locale={{ emptyText: "No courses found" }}
    />
  );
}
