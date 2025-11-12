"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Card, 
  Tag,
  Badge,
  message,
  Modal
} from "antd";
import { Title } from "@/components/antd";
import { 
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  UserOutlined
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
  const [modal, modalContextHolder] = Modal.useModal();
  const router = useRouter();

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/participants');
      const data = await response.json();
      setParticipants(data.participants || []);
    } catch (error) {
      messageApi.error('Failed to fetch participants');
      console.error('Error fetching participants:', error);
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
            method: 'DELETE',
          });

          if (response.ok) {
            messageApi.success("Participant deleted successfully!");
            fetchParticipants();
          } else {
            messageApi.error("Failed to delete participant");
          }
        } catch (error) {
          messageApi.error("Failed to delete participant");
          console.error('Error deleting participant:', error);
        }
      },
    });
  };

  // Search and filter
  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchText.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchText.toLowerCase()) ||
    participant.year.toString().includes(searchText)
  );

  const columns = [
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
      title: "Year",
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
          style={{ fontSize: '12px' }}
        />
      ),
    },
    {
      title: "Active Courses",
      key: "activeCourses",
      align: "center" as const,
      render: (_: any, record: Participant) => {
        const activeCourses = record.enrollments?.filter(e => e.progress < 100).length || 0;
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
            type="link"
            danger
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

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
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
            onClick={() => router.push("/participants/new")}
          >
            Add Participant
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredParticipants.map(participant => ({ 
            key: participant.id, 
            ...participant 
          }))}
          pagination={{ pageSize: 10 }}
          bordered
          loading={loading}
          locale={{ emptyText: "No participants found" }}
        />
      </Card>

      {contextHolder}
      {modalContextHolder}
    </div>
  );
}