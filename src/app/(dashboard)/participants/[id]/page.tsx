"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Space,
  Form,
  Input,
  Modal,
  message,
  Tag,
  Select,
  Table,
  Tabs,
  Progress,
  List,
  Typography,
  Divider,
  Collapse,
  Badge,
  Checkbox,
  Row,
  Col,
  Statistic,
  Spin,
  Result,
} from "antd";
import { Title } from "@/components/antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  EyeOutlined,
  UserOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

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
  status: "in_progress" | "completed";
  updatedAt: string;
  assetType?: string;
  assetLink?: string;
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

interface CourseDetail {
  id: string;
  name: string;
  description: string;
  categories: CategoryDetail[];
}

interface CategoryDetail {
  id: string;
  name: string;
  orderIndex: number;
  sessions: SessionDetail[];
}

interface SessionDetail {
  id: string;
  title: string;
  assetType: string;
  assetLink: string;
  orderIndex: number;
  progress?: SessionProgress;
}

export default function ParticipantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const participantId = params.id as string;

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [courseDetails, setCourseDetails] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
  const [isProgressModalVisible, setIsProgressModalVisible] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);

  const [editForm] = Form.useForm();
  const [enrollForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const fetchParticipantDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/participants/${participantId}`);
      const data = await response.json();
      setParticipant(data.participant);
      console.log("Fetched participant:", data.participant);
    } catch (error) {
      messageApi.error("Failed to fetch participant details");
      console.error("Error fetching participant:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchCourseDetails = async (courseId: string) => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}?participantId=${participantId}`
      );
      const data = await response.json();
      setCourseDetails(data.course);
    } catch (error) {
      messageApi.error("Failed to fetch course details");
      console.error("Error fetching course details:", error);
    }
  };

  useEffect(() => {
    if (participantId) {
      fetchParticipantDetails();
      fetchCourses();
    }
  }, [participantId]);

  // Participant Operations
  const handleEditParticipant = async (values: {
    name: string;
    email: string;
    year: number;
  }) => {
    try {
      const response = await fetch(`/api/participants/${participantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        messageApi.success("Participant updated successfully!");
        setIsEditModalVisible(false);
        editForm.resetFields();
        fetchParticipantDetails();
      } else {
        messageApi.error("Failed to update participant");
      }
    } catch (error) {
      messageApi.error("Failed to update participant");
      console.error("Error updating participant:", error);
    }
  };

  // Enrollment Operations
  const handleEnrollParticipant = async (values: { courseId: string }) => {
    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: participantId,
          courseId: values.courseId,
        }),
      });

      if (response.ok) {
        messageApi.success("Participant enrolled successfully!");
        setIsEnrollModalVisible(false);
        enrollForm.resetFields();
        // fetchParticipantDetails();/
        // handle endroll without refetching participant details
        const newEnrollment = await response.json();
        setParticipant((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            enrollments: [...prev.enrollments, newEnrollment.enrollment],
          };
        });
      } else {
        messageApi.error("Failed to enroll participant");
      }
    } catch (error) {
      messageApi.error("Failed to enroll participant");
      console.error("Error enrolling participant:", error);
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    modal.confirm({
      title: "Are you sure you want to unenroll this participant?",
      content: "All their progress in this course will be lost.",
      okText: "Yes, Unenroll",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const response = await fetch(`/api/enrollments/${enrollmentId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            messageApi.success("Participant unenrolled successfully!");
            // fetchParticipantDetails();
            // handle unenroll without refetching participant details
            setParticipant((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                enrollments: prev.enrollments.filter(
                  (e) => e.id !== enrollmentId
                ),
              };
            });
          } else {
            messageApi.error("Failed to unenroll participant");
          }
        } catch (error) {
          messageApi.error("Failed to unenroll participant");
          console.error("Error unenrolling participant:", error);
        }
      },
    });
  };

  // Session Progress Operations
  const handleUpdateSessionProgress = async (
    sessionId: string,
    status: "in_progress" | "completed"
  ) => {
    if (!participant) return;

    setUpdatingProgress(sessionId);
    try {
      const response = await fetch("/api/session-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          participantId: participant.id,
          status,
        }),
      });

      if (response.ok) {
        messageApi.success(`Session marked as ${status.replace("_", " ")}`);
        if (selectedEnrollment) {
          fetchCourseDetails(selectedEnrollment.courseId);
        }
        // fetchParticipantDetails();
        // Update session progress locally without refetching participant details
        const updatedProgress = await response.json();
        setParticipant((prev) => {
          if (!prev) return prev;
          const existingProgressIndex = prev.sessionProgress.findIndex(
            (sp) => sp.sessionId === sessionId
          );
          let updatedSessionProgress = [...prev.sessionProgress];
          if (existingProgressIndex >= 0) {
            updatedSessionProgress[existingProgressIndex] =
              updatedProgress.sessionProgress;
          } else {
            updatedSessionProgress.push(updatedProgress.sessionProgress);
          }
          return {
            ...prev,
            sessionProgress: updatedSessionProgress,
          };
        });
      } else {
        messageApi.error("Failed to update session progress");
      }
    } catch (error) {
      messageApi.error("Failed to update session progress");
      console.error("Error updating session progress:", error);
    } finally {
      setUpdatingProgress(null);
    }
  };

  const handleViewProgress = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsProgressModalVisible(true);
    fetchCourseDetails(enrollment.courseId);
  };

  const renderAssetLink = (session: SessionDetail) => {
    if (!session.assetLink) return null;

    switch (session.assetType) {
      case "youtube":
        return (
          <Button
            type="link"
            icon={<PlayCircleOutlined />}
            href={session.assetLink}
            target="_blank"
            size="small"
          >
            Watch Video
          </Button>
        );
      case "pdf":
        return (
          <Button
            type="link"
            icon={<EyeOutlined />}
            href={session.assetLink}
            target="_blank"
            size="small"
          >
            View PDF
          </Button>
        );
      case "web":
        return (
          <Button
            type="link"
            icon={<EyeOutlined />}
            href={session.assetLink}
            target="_blank"
            size="small"
          >
            Visit Link
          </Button>
        );
      default:
        return (
          <Button
            type="link"
            icon={<EyeOutlined />}
            href={session.assetLink}
            target="_blank"
            size="small"
          >
            View Content
          </Button>
        );
    }
  };

  // Enrollment Columns for Overview Tab
  const enrollmentColumns = [
    {
      title: "Course",
      dataIndex: ["course", "name"], // use array path for nested data
      key: "courseName",
      render: (name: string) => <strong>{name}</strong>,
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (progress: number) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Progress
            percent={Math.round(progress)}
            size="small"
            style={{ margin: 0, flex: 1 }}
            status={progress === 100 ? "success" : "active"}
          />
          <Text type="secondary">{Math.round(progress)}%</Text>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: Enrollment) => (
        <Tag
          color={
            record.progress === 100
              ? "green"
              : record.progress > 0
              ? "blue"
              : "default"
          }
        >
          {record.progress === 100
            ? "Completed"
            : record.progress > 0
            ? "In Progress"
            : "Not Started"}
        </Tag>
      ),
    },
    {
      title: "Enrolled Date",
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    // In the enrollmentColumns array, update the actions column:
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Enrollment) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(
                `/participants/${participantId}/course/${record.courseId}`
              )
            }
          >
            View Course Details
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

  // Progress Columns for Progress Tab
  const progressColumns = [
    {
      title: "Session",
      dataIndex: "sessionTitle",
      key: "sessionTitle",
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "completed" ? "green" : "blue"}>
          {status.replace("_", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
  if (!participant) {
    return (
      <div style={{ padding: 40 }}>
        <Result
          status="404"
          title="Participant Not Found"
          subTitle="The participant you're looking for does not exist or has been removed."
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* Header */}
        <Card>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/participants")}
            >
              Back to Participants
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              <UserOutlined /> {participant.name}
            </Title>
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  editForm.setFieldsValue({
                    name: participant.name,
                    email: participant.email,
                    year: participant.year,
                  });
                  setIsEditModalVisible(true);
                }}
              >
                Edit Participant
              </Button>
            </Space>
          </Space>
        </Card>

        {/* Statistics */}
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Enrollments"
                value={participant.enrollments?.length || 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Completed Courses"
                value={
                  participant.enrollments?.filter((e) => e.progress === 100)
                    .length || 0
                }
                suffix="/ courses"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Average Progress"
                value={Math.round(
                  participant.enrollments?.reduce(
                    (acc, e) => acc + e.progress,
                    0
                  ) / (participant.enrollments?.length || 1)
                )}
                suffix="%"
              />
            </Card>
          </Col>
          {/* <Col span={6}>
            <Card>
              <Statistic 
                title="Member Since" 
                value={new Date(participant.createdAt).getFullYear()} 
                prefix={<UserOutlined />}
              />
            </Card>
          </Col> */}
        </Row>

        {/* Tabs */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* Overview Tab */}
            <TabPane tab="Overview" key="overview">
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="large"
              >
                <Card title="Participant Information">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Paragraph>
                        <Text strong>Name: </Text>
                        {participant.name}
                      </Paragraph>
                    </Col>
                    <Col span={8}>
                      <Paragraph>
                        <Text strong>Email: </Text>
                        {participant.email}
                      </Paragraph>
                    </Col>
                    <Col span={8}>
                      <Paragraph>
                        <Text strong>Year: </Text>
                        <Tag color="blue">{participant.year}</Tag>
                      </Paragraph>
                    </Col>
                  </Row>
                  <Paragraph>
                    <Text strong>Joined: </Text>
                    {new Date(participant.createdAt).toLocaleDateString()}
                  </Paragraph>
                </Card>

                <Card
                  title="Course Enrollments"
                  extra={
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => setIsEnrollModalVisible(true)}
                    >
                      Enroll in New Course
                    </Button>
                  }
                >
                  <Table
                    columns={enrollmentColumns}
                    dataSource={
                      participant.enrollments?.map((enroll) => ({
                        key: enroll.id,
                        ...enroll,
                      })) || []
                    }
                    pagination={false}
                    locale={{ emptyText: "Not enrolled in any courses" }}
                  />
                </Card>
              </Space>
            </TabPane>

            {/* Progress History Tab */}
            <TabPane tab="Progress History" key="progress">
              <Card>
                <Table
                  columns={progressColumns}
                  dataSource={
                    participant.sessionProgress?.map((progress) => ({
                      key: progress.id,
                      ...progress,
                    })) || []
                  }
                  pagination={{ pageSize: 10 }}
                  locale={{ emptyText: "No session progress recorded" }}
                />
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      </Space>

      {/* Edit Participant Modal */}
      <Modal
        title="Edit Participant"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditParticipant}
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
                Update Participant
              </Button>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Enroll Participant Modal */}
      <Modal
        title={`Enroll ${participant.name} in Course`}
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
              options={courses.map((course) => ({
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

      {/* Progress Management Modal */}
      {/* <Modal
        title={
          <div>
            <div>Manage Progress: {participant.name}</div>
            <div style={{ fontSize: 14, fontWeight: 'normal', color: '#666' }}>
              Course: {selectedEnrollment?.courseName}
            </div>
          </div>
        }
        open={isProgressModalVisible}
        onCancel={() => {
          setIsProgressModalVisible(false);
          setCourseDetails(null);
        }}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsProgressModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {courseDetails && (
          <div>
            <Paragraph>{courseDetails.description}</Paragraph>
            <Divider />
            
            <Collapse defaultActiveKey={['0']}>
              {courseDetails.categories?.map((category) => (
                <Panel 
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>{category.name}</Text>
                      <Badge 
                        count={
                          category.sessions.filter(s => s.progress?.status === 'completed').length + 
                          '/' + 
                          category.sessions.length
                        } 
                        style={{ backgroundColor: '#52c41a' }} 
                      />
                    </div>
                  } 
                  key={category.id}
                >
                  <List
                    dataSource={category.sessions.sort((a, b) => a.orderIndex - b.orderIndex)}
                    renderItem={(session) => (
                      <List.Item
                        actions={[
                          <div key="status" style={{ width: 120, textAlign: 'right' }}>
                            <Checkbox
                              checked={session.progress?.status === 'completed'}
                              disabled={updatingProgress === session.id}
                              onChange={(e) => 
                                handleUpdateSessionProgress(
                                  session.id, 
                                  e.target.checked ? 'completed' : 'in_progress'
                                )
                              }
                            >
                              <Text type={session.progress?.status === 'completed' ? 'success' : 'secondary'}>
                                {session.progress?.status === 'completed' ? 'Completed' : 'Mark Complete'}
                              </Text>
                            </Checkbox>
                          </div>,
                          renderAssetLink(session)
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            session.progress?.status === 'completed' ? (
                              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                            ) : (
                              <div style={{ width: 16, height: 16, border: '2px solid #d9d9d9', borderRadius: 2 }} />
                            )
                          }
                          title={session.title}
                          description={
                            <Text type="secondary">
                              {session.assetType?.toUpperCase()} • Order: {session.orderIndex}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>

            <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Overall Course Progress</Text>
                <Text strong type="success">
                  {selectedEnrollment?.progress ? Math.round(selectedEnrollment.progress) : 0}%
                </Text>
              </div>
              <Progress 
                percent={selectedEnrollment?.progress ? Math.round(selectedEnrollment.progress) : 0} 
                status={selectedEnrollment?.progress === 100 ? "success" : "active"}
                style={{ marginTop: 8 }}
              />
            </div>
          </div>
        )}
      </Modal> */}

      {contextHolder}
      {modalContextHolder}
    </div>
  );
}
