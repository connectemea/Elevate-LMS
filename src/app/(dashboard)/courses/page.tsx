"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Tag,
  message,
  Modal,
  Form,
  Input,
} from "antd";

import { Title } from "@/components/antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    enrollments: number;
    categories: number;
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourseForm] = Form.useForm();
  const [isAddCourseModalVisible, setIsAddCourseModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      const data = await response.json();
      setCourses(data.courses || []);
      console.log("Fetched courses:", data.courses);
    } catch (error) {
      messageApi.error("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleViewDetails = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const handleAddCourse = async (values: {
    name: string;
    description: string;
  }) => {
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        messageApi.success("Course added successfully!");
        setIsAddCourseModalVisible(false);
        newCourseForm.resetFields();
        fetchCourses();
      } else {
        messageApi.error("Failed to add course");
      }
    } catch (error) {
      messageApi.error("Failed to add course");
      console.error("Error adding course:", error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    modal.confirm({
      title: "Are you sure you want to delete this course?",
      content: "This will delete all categories, sessions, and enrollments.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const response = await fetch(`/api/courses/${courseId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            messageApi.success("Course deleted successfully!");
            fetchCourses();
          } else {
            messageApi.error("Failed to delete course");
          }
        } catch (error) {
          messageApi.error("Failed to delete course");
          console.error("Error deleting course:", error);
        }
      },
    });
  };

  const columns = [
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <strong>{name}</strong>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (description: string) => description || "No description",
    },
    {
      title: "Enrolled",
      dataIndex: ["_count", "enrollments"],
      key: "enrollments",
      align: "center" as const,
      render: (enrolled: number) => (
        <Tag color="blue">{enrolled || 0} students</Tag>
      ),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      align: "center" as const,
      render: (categories: any[] = []) => (
        <Tag>{categories.length} categories</Tag>
      ),
    },

    {
      title: "Status",
      key: "status",
      align: "center" as const,
      render: () => <Tag color="green">Active</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: Course) => (
        <Space
          direction="vertical"
          size="small"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
          >
            View Details
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCourse(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Courses Management</Title>

      <Card 
       style={{
            overflowX: "auto",
            marginBottom: 16,
          }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddCourseModalVisible(true)}
          >
            Add New Course
          </Button>
        </div>

        <Table
          style={{
            minWidth: 700
          }}
          columns={columns}
          dataSource={courses.map((course) => ({ key: course.id, ...course }))}
          pagination={{ pageSize: 10 }}
          bordered
          loading={loading}
          locale={{ emptyText: "No courses found" }}
        />
      </Card>

      {/* Add Course Modal */}
      <Modal
        title="Add New Course"
        open={isAddCourseModalVisible}
        onCancel={() => {
          setIsAddCourseModalVisible(false);
          newCourseForm.resetFields();
        }}
        footer={null}
      >
        <Form form={newCourseForm} layout="vertical" onFinish={handleAddCourse}>
          <Form.Item
            name="name"
            label="Course Name"
            rules={[{ required: true, message: "Please enter course name" }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter course description" },
            ]}
          >
            <Input.TextArea placeholder="Enter course description" rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Course
              </Button>
              <Button onClick={() => setIsAddCourseModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {contextHolder}
      {modalContextHolder}
    </div>
  );
}
