"use client";

import { useState } from "react";
import { Table, Button, Space, Input, Title, Card } from "@/components/antd";

interface Course {
  key: string;
  name: string;
  description: string;
  enrolled: number;
  categories: { id: string; name: string; orderIndex: number }[];
}

export default function CoursesPage() {
  // --- dummy data (later fetched via Prisma)
  const [courses, setCourses] = useState<Course[]>([
    {
      key: "1",
      name: "React Basics",
      description: "Learn the fundamentals of React.js",
      enrolled: 120,
      categories: [
        { id: "1-1", name: "Introduction to JSX", orderIndex: 1 },
        { id: "1-2", name: "State and Props", orderIndex: 2 },
      ],
    },
    {
      key: "2",
      name: "Next.js Advanced",
      description: "Server rendering and app router deep dive",
      enrolled: 85,
      categories: [
        { id: "2-1", name: "Routing and Layouts", orderIndex: 1 },
        { id: "2-2", name: "Server Actions", orderIndex: 2 },
      ],
    },
  ]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // --- column definitions
  const columns = [
    {
      title: "Course Name",
      dataIndex: "name",
      render: (_: any, record: Course) => {
        if (editingKey === record.key) {
          return (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Edit course name"
            />
          );
        }
        return record.name;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Enrolled",
      dataIndex: "enrolled",
      align: "center" as const,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Course) => {
        const editable = editingKey === record.key;
        return (
          <Space>
            {editable ? (
              <>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    const updated = courses.map((c) =>
                      c.key === record.key ? { ...c, name: editValue } : c
                    );
                    setCourses(updated);
                    setEditingKey(null);
                  }}
                >
                  Save
                </Button>
                <Button size="small" onClick={() => setEditingKey(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    setEditingKey(record.key);
                    setEditValue(record.name);
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() =>
                    setCourses(courses.filter((c) => c.key !== record.key))
                  }
                >
                  Delete
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  // --- render subtopics (categories)
  const expandedRowRender = (course: Course) => {
    const categoryColumns = [
      { title: "Order", dataIndex: "orderIndex", width: 100 },
      { title: "Category Name", dataIndex: "name" },
    ];

    return (
      <Table
        columns={categoryColumns}
        dataSource={course.categories.map((c) => ({ key: c.id, ...c }))}
        pagination={false}
        size="small"
      />
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Courses</Title>

      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Button type="primary" onClick={() => alert("TODO: Add Course modal")}>
            + Add Course
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={courses}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.categories.length > 0,
          }}
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>
    </div>
  );
}
