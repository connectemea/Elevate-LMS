"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Input,
  Form,
  Card,
  Tag,
  Badge,
  message,
  Modal,
} from "antd";
import  Button  from "@/components/ui/Button";
import { Title } from "@/components/antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  progress: number;
  enrolledAt: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  year: number;
  createdAt: string;
  enrollments: Enrollment[];
  _count?: {
    enrollments: number;
  };
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isAddParticipantModalVisible, setIsAddParticipantModalVisible] =
    useState(false);
  const [newParticipantForm] = Form.useForm();
  const [modal, modalContextHolder] = Modal.useModal();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/participants");
      const data = await response.json();
      setParticipants(data.participants || []);
    } catch (error) {
      messageApi.error("Failed to fetch participants");
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleViewDetails = (participantId: string) => {
    router.push(`/participants/${participantId}`);
  };

  const handleAddParticipant = async (values: {
    name: string;
    email: string;
    year: number;
  }) => {
    try {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json(); // parse JSON always

      if (!response.ok) {
        if (result.errorDetails?.code === "email_exists") {
          messageApi.error("This email is already registered.");
        } else {
          messageApi.error(result.error || "Failed to add participant.");
        }
        return;
      }

      // Success
      messageApi.success("Participant added successfully!");
      setIsAddParticipantModalVisible(false);
      newParticipantForm.resetFields();
      fetchParticipants();
    } catch (error: any) {
      console.error("Error adding participant:", error);

      messageApi.error(
        error?.message || "Something went wrong when adding participant."
      );
    }
  };

  const handleDeleteParticipant = async (participantId: string) => {
    modal.confirm({
      title: "Are you sure you want to delete this participant?",
      content: "All their enrollments and progress will also be deleted.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const response = await fetch(`/api/participants/${participantId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            messageApi.success("Participant deleted successfully!");
            fetchParticipants();
          } else {
            messageApi.error("Failed to delete participant");
          }
        } catch (error) {
          messageApi.error("Failed to delete participant");
          console.error("Error deleting participant:", error);
        }
      },
    });
  };

  // Search and filter
  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchText.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchText.toLowerCase()) ||
      participant.year.toString().includes(searchText)
  );

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <Space>
          <UserOutlined />
          <strong>{name}</strong>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Year (clg joined)",
      dataIndex: "year",
      key: "year",
      align: "center" as const,
      render: (year: number) => <Tag color="blue">{year}</Tag>,
    },
    {
      title: "Enrollments",
      dataIndex: "enrollments",
      key: "enrollments",
      align: "center" as const,
      render: (enrollments: Enrollment[]) => (
        <Badge
          count={enrollments?.length || 0}
          showZero
          color="blue"
          style={{ fontSize: "12px" }}
        />
      ),
    },
    {
      title: "Active Courses",
      key: "activeCourses",
      align: "center" as const,
      render: (_: any, record: Participant) => {
        const activeCourses =
          record.enrollments?.filter((e) => e.progress < 100).length || 0;
        return (
          <Tag color={activeCourses > 0 ? "green" : "default"}>
            {activeCourses} active
          </Tag>
        );
      },
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: Participant) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
          >
            View Details
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteParticipant(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Participants Management</Title>

      <Card
        style={{
          marginBottom: 16,
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Input
            placeholder="Search participants by name, email, or year..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 400 }}
            allowClear
            prefix={<UserOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddParticipantModalVisible(true)}
          >
            Add Participant
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredParticipants.map((participant) => ({
            key: participant.id,
            ...participant,
          }))}
          pagination={{
            current: currentPage,
            pageSize,
            pageSizeOptions: ["10", "20", "50", "100"], // 👈 dropdown options
            showSizeChanger: true, // 👈 enables the selector
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          bordered
          loading={loading}
          locale={{ emptyText: "No participants found" }}
        />

        <div style={{ textAlign: "right", marginTop: 10 }}>
          Total: {filteredParticipants.length}
        </div>
      </Card>

      {/* Add Participant Modal */}
      <Modal
        title="Add New Participant"
        open={isAddParticipantModalVisible}
        onCancel={() => {
          setIsAddParticipantModalVisible(false);
          newParticipantForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={newParticipantForm}
          layout="vertical"
          onFinish={handleAddParticipant}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter participant name" },
            ]}
          >
            <Input placeholder="Enter full name" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email address" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email address" type="email" />
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: "Please enter year" }]}
          >
            <Input
              placeholder="Enter year"
              type="number"
              min={2000}
              max={2030}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Participant
              </Button>
              <Button onClick={() => setIsAddParticipantModalVisible(false)}>
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
