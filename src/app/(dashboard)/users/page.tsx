"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Card, 
  Form, 
  Modal, 
  message, 
  Tag,
  Select,
  Progress,
  Badge
} from "antd";
import {Title} from "@/components/antd"
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  SaveOutlined, 
  CloseOutlined,
  EyeOutlined,
  UserOutlined
} from "@ant-design/icons";

interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  progress: number;
  enrolledAt: string;
}

interface SessionProgress {
  id: string;
  sessionId: string;
  sessionTitle: string;
  status: 'in_progress' | 'completed';
  updatedAt: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  year: number;
  createdAt: string;
  enrollments: Enrollment[];
  sessionProgress: SessionProgress[];
  isEditing?: boolean;
  tempName?: string;
  tempEmail?: string;
  tempYear?: number;
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddParticipantModalVisible, setIsAddParticipantModalVisible] = useState(false);
  const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [searchText, setSearchText] = useState("");
  const [newParticipantForm] = Form.useForm();
  const [enrollForm] = Form.useForm();
  const [courses, setCourses] = useState<any[]>([]);

  // Fetch participants and courses
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/participants');
      const data = await response.json();
      setParticipants(data.participants || []);
    } catch (error) {
      message.error('Failed to fetch participants');
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchCourses();
  }, []);

  // --- Participant CRUD Operations
  const handleAddParticipant = async (values: { name: string; email: string; year: number }) => {
    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Participant added successfully!");
        setIsAddParticipantModalVisible(false);
        newParticipantForm.resetFields();
        fetchParticipants();
      } else {
        message.error("Failed to add participant");
      }
    } catch (error) {
      message.error("Failed to add participant");
      console.error('Error adding participant:', error);
    }
  };

  const handleEditParticipant = (participantId: string) => {
    setParticipants(participants.map(participant => 
      participant.id === participantId 
        ? { 
            ...participant, 
            isEditing: true, 
            tempName: participant.name, 
            tempEmail: participant.email,
            tempYear: participant.year
          }
        : participant
    ));
  };

  const handleSaveParticipant = async (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    if (!participant) return;

    try {
      const response = await fetch(`/api/participants/${participantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: participant.tempName || participant.name,
          email: participant.tempEmail || participant.email,
          year: participant.tempYear || participant.year,
        }),
      });

      if (response.ok) {
        message.success("Participant updated successfully!");
        fetchParticipants();
      } else {
        message.error("Failed to update participant");
      }
    } catch (error) {
      message.error("Failed to update participant");
      console.error('Error updating participant:', error);
    }
  };

  const handleCancelParticipantEdit = (participantId: string) => {
    setParticipants(participants.map(participant => 
      participant.id === participantId 
        ? { ...participant, isEditing: false }
        : participant
    ));
  };

  const handleDeleteParticipant = async (participantId: string) => {
    Modal.confirm({
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
            message.success("Participant deleted successfully!");
            fetchParticipants();
          } else {
            message.error("Failed to delete participant");
          }
        } catch (error) {
          message.error("Failed to delete participant");
          console.error('Error deleting participant:', error);
        }
      },
    });
  };

  // --- Enrollment Operations
  const handleEnrollParticipant = async (values: { courseId: string }) => {
    if (!selectedParticipant) return;

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId: selectedParticipant.id,
          courseId: values.courseId,
        }),
      });

      if (response.ok) {
        message.success("Participant enrolled successfully!");
        setIsEnrollModalVisible(false);
        enrollForm.resetFields();
        fetchParticipants();
      } else {
        message.error("Failed to enroll participant");
      }
    } catch (error) {
      message.error("Failed to enroll participant");
      console.error('Error enrolling participant:', error);
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    Modal.confirm({
      title: "Are you sure you want to unenroll this participant?",
      content: "All their progress in this course will be lost.",
      okText: "Yes, Unenroll",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const response = await fetch(`/api/enrollments/${enrollmentId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            message.success("Participant unenrolled successfully!");
            fetchParticipants();
          } else {
            message.error("Failed to unenroll participant");
          }
        } catch (error) {
          message.error("Failed to unenroll participant");
          console.error('Error unenrolling participant:', error);
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

  // --- Column Definitions
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name: string, record: Participant) => {
        if (record.isEditing) {
          return (
            <Input
              value={record.tempName}
              onChange={(e) => 
                setParticipants(participants.map(p => 
                  p.id === record.id 
                    ? { ...p, tempName: e.target.value }
                    : p
                ))
              }
              placeholder="Participant name"
              prefix={<UserOutlined />}
            />
          );
        }
        return <strong>{name}</strong>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email: string, record: Participant) => {
        if (record.isEditing) {
          return (
            <Input
              value={record.tempEmail}
              onChange={(e) => 
                setParticipants(participants.map(p => 
                  p.id === record.id 
                    ? { ...p, tempEmail: e.target.value }
                    : p
                ))
              }
              placeholder="Email address"
              type="email"
            />
          );
        }
        return email;
      },
    },
    {
      title: "Year",
      dataIndex: "year",
      align: "center" as const,
      render: (year: number, record: Participant) => {
        if (record.isEditing) {
          return (
            <Input
              value={record.tempYear}
              onChange={(e) => 
                setParticipants(participants.map(p => 
                  p.id === record.id 
                    ? { ...p, tempYear: parseInt(e.target.value) || 0 }
                    : p
                ))
              }
              placeholder="Year"
              type="number"
              style={{ width: 100 }}
            />
          );
        }
        return <Tag color="blue">{year}</Tag>;
      },
    },
    {
      title: "Enrollments",
      dataIndex: "enrollments",
      align: "center" as const,
      render: (enrollments: Enrollment[]) => (
        <Badge count={enrollments?.length || 0} showZero color="blue" />
      ),
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 250,
      render: (_: any, record: Participant) => {
        const isEditing = record.isEditing;
        
        return (
          <Space>
            {isEditing ? (
              <>
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<SaveOutlined />}
                  onClick={() => handleSaveParticipant(record.id)}
                >
                  Save
                </Button>
                <Button 
                  size="small" 
                  icon={<CloseOutlined />}
                  onClick={() => handleCancelParticipantEdit(record.id)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button 
                  type="link" 
                  icon={<EditOutlined />}
                  onClick={() => handleEditParticipant(record.id)}
                >
                  Edit
                </Button>
                <Button 
                  type="link" 
                  icon={<EyeOutlined />}
                  onClick={() => {
                    setSelectedParticipant(record);
                    // You can add a view details modal here
                  }}
                >
                  View
                </Button>
                <Button 
                  type="link" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteParticipant(record.id)}
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

  // --- Expanded Row Render for Enrollments and Progress
  const expandedRowRender = (participant: Participant) => {
    const enrollmentColumns = [
      {
        title: "Course",
        dataIndex: "courseName",
        render: (courseName: string) => <strong>{courseName}</strong>,
      },
      {
        title: "Progress",
        dataIndex: "progress",
        render: (progress: number) => (
          <Progress 
            percent={Math.round(progress)} 
            size="small" 
            status={progress === 100 ? "success" : "active"}
          />
        ),
      },
      {
        title: "Enrolled Date",
        dataIndex: "enrolledAt",
        render: (date: string) => new Date(date).toLocaleDateString(),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: any, record: Enrollment) => (
          <Space>
            <Button 
              type="link" 
              size="small"
              onClick={() => {
                // View course progress details
                message.info(`Viewing progress for ${record.courseName}`);
              }}
            >
              View Progress
            </Button>
            <Button 
              type="link" 
              danger 
              size="small"
              onClick={() => handleUnenroll(record.id)}
            >
              Unenroll
            </Button>
          </Space>
        ),
      },
    ];

    const progressColumns = [
      {
        title: "Session",
        dataIndex: "sessionTitle",
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status: string) => (
          <Tag color={status === 'completed' ? 'green' : 'blue'}>
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Last Updated",
        dataIndex: "updatedAt",
        render: (date: string) => new Date(date).toLocaleDateString(),
      },
    ];

    return (
      <div>
        {/* Enrollments Section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4>Course Enrollments</h4>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedParticipant(participant);
                setIsEnrollModalVisible(true);
              }}
            >
              Enroll in Course
            </Button>
          </div>
          <Table
            columns={enrollmentColumns}
            dataSource={participant.enrollments?.map(enroll => ({ key: enroll.id, ...enroll })) || []}
            pagination={false}
            size="small"
            bordered
            locale={{ emptyText: "Not enrolled in any courses" }}
          />
        </div>

        {/* Session Progress Section */}
        <div>
          <h4 style={{ marginBottom: 16 }}>Session Progress</h4>
          <Table
            columns={progressColumns}
            dataSource={participant.sessionProgress?.map(progress => ({ key: progress.id, ...progress })) || []}
            pagination={false}
            size="small"
            bordered
            locale={{ emptyText: "No session progress recorded" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Participants Management</Title>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Input
            placeholder="Search participants by name, email, or year..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
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
          dataSource={filteredParticipants.map(participant => ({ key: participant.id, ...participant }))}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => true,
          }}
          pagination={{ pageSize: 10 }}
          bordered
          loading={loading}
          locale={{ emptyText: "No participants found" }}
        />
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
            rules={[{ required: true, message: "Please enter participant name" }]}
          >
            <Input placeholder="Enter full name" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email address" },
              { type: 'email', message: 'Please enter a valid email' }
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

      {/* Enroll Participant Modal */}
      <Modal
        title={`Enroll ${selectedParticipant?.name} in Course`}
        open={isEnrollModalVisible}
        onCancel={() => {
          setIsEnrollModalVisible(false);
          enrollForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={enrollForm}
          layout="vertical"
          onFinish={handleEnrollParticipant}
        >
          <Form.Item
            name="courseId"
            label="Select Course"
            rules={[{ required: true, message: "Please select a course" }]}
          >
            <Select
              placeholder="Choose a course"
              options={courses.map(course => ({
                value: course.id,
                label: course.name,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Enroll Participant
              </Button>
              <Button onClick={() => setIsEnrollModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}