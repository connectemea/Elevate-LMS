"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Space,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Tag,
  Select,
  Table,
  Tabs,
  Collapse,
  List,
  Typography,
  Divider,
  Statistic,
  Row,
  Col,
} from "antd";
import { Title } from "@/components/antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  LinkOutlined,
  FileTextOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

interface Session {
  id: string;
  title: string;
  assetLink: string;
  assetType: "youtube" | "web" | "pdf" | "other";
  orderIndex: number;
  createdAt: string;
  isEditing?: boolean;
  tempTitle?: string;
  tempAssetLink?: string;
  tempAssetType?: string;
  tempOrderIndex?: number;
}

interface Category {
  id: string;
  name: string;
  orderIndex: number;
  isEditing?: boolean;
  tempName?: string;
  tempOrderIndex?: number;
  sessions: Session[];
}

interface Course {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  _count?: {
    enrollments: number;
  };
  isEditing?: boolean;
  tempName?: string;
  tempDescription?: string;
}

interface Enrollment {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  progress: number;
  completedSessions: number;
  totalSessions: number;
  enrolledAt: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
  const [isAddSessionModalVisible, setIsAddSessionModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [newCategoryForm] = Form.useForm();
  const [newSessionForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      setCourse(data.course);
    } catch (error) {
      messageApi.error("Failed to fetch course details");
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/enrollments`);
      const data = await response.json();
      setEnrollments(data.enrollments || []);
    } catch (error) {
      messageApi.error("Failed to fetch enrollments");
      console.error("Error fetching enrollments:", error);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchEnrollments();
    }
  }, [courseId]);

  // Category CRUD Operations
  const handleAddCategory = async (values: { name: string; orderIndex: number }) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, courseId }),
      });

      if (response.ok) {
        messageApi.success("Category added successfully!");
        setIsAddCategoryModalVisible(false);
        newCategoryForm.resetFields();
        fetchCourseDetails();
      } else {
        messageApi.error("Failed to add category");
      }
    } catch (error) {
      messageApi.error("Failed to add category");
      console.error("Error adding category:", error);
    }
  };

  // Session CRUD Operations
  const handleAddSession = async (values: {
    title: string;
    assetLink: string;
    assetType: "youtube" | "web" | "pdf" | "other";
    orderIndex: number;
  }) => {
    if (!selectedCategoryId) return;

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, categoryId: selectedCategoryId }),
      });

      if (response.ok) {
        messageApi.success("Session added successfully!");
        setIsAddSessionModalVisible(false);
        newSessionForm.resetFields();
        fetchCourseDetails();
      } else {
        messageApi.error("Failed to add session");
      }
    } catch (error) {
      messageApi.error("Failed to add session");
      console.error("Error adding session:", error);
    }
  };

  const renderAssetIcon = (assetType: string) => {
    switch (assetType) {
      case "youtube": return <PlayCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "web": return <LinkOutlined style={{ color: "#1890ff" }} />;
      case "pdf": return <FileTextOutlined style={{ color: "#52c41a" }} />;
      default: return <EyeOutlined />;
    }
  };

  const renderAssetTag = (assetType: string) => {
    const colors = { youtube: "red", web: "blue", pdf: "green", other: "default" };
    return <Tag color={colors[assetType as keyof typeof colors]}>{assetType.toUpperCase()}</Tag>;
  };

  // Enrollment Columns
  const enrollmentColumns = [
    {
      title: "Student",
      dataIndex: ["user", "name"],
      key: "student",
      render: (name: string, record: Enrollment) => (
        <Space>
          <UserOutlined />
          <div>
            <div>{name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.user.email}</Text>
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
      title: "Sessions Completed",
      dataIndex: "completedSessions",
      key: "completedSessions",
      render: (completed: number, record: Enrollment) => (
        <Text>{completed} / {record.totalSessions}</Text>
      ),
      sorter: (a: Enrollment, b: Enrollment) => a.completedSessions - b.completedSessions,
    },
    {
      title: "Enrolled Date",
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!course) {
    return <div style={{ padding: 24 }}>Course not found</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* Header */}
        <Card>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/courses")}>
              Back to Courses
            </Button>
            <Title level={2} style={{ margin: 0 }}>{course.name}</Title>
            <Space>
              <Button type="primary" icon={<EditOutlined />}>
                Edit Course
              </Button>
            </Space>
          </Space>
        </Card>

        {/* Statistics */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic title="Total Enrollments" value={course._count?.enrollments || 0} prefix={<UserOutlined />} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Categories" value={course.categories?.length || 0} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Total Sessions" value={course.categories?.reduce((acc, cat) => acc + cat.sessions.length, 0) || 0} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Completion Rate" value={75} suffix="%" />
            </Card>
          </Col>
        </Row>

        {/* Tabs */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* Course Details Tab */}
            <TabPane tab="Course Details" key="details">
              <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Card title="Course Information">
                  <Paragraph>
                    <Text strong>Description: </Text>
                    {course.description || "No description provided"}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Created: </Text>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Last Updated: </Text>
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </Paragraph>
                </Card>

                <Card 
                  title="Categories & Sessions" 
                  extra={
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => setIsAddCategoryModalVisible(true)}
                    >
                      Add Category
                    </Button>
                  }
                >
                  {course.categories?.map((category) => (
                    <Collapse key={category.id} style={{ marginBottom: 16 }}>
                      <Panel
                        key={category.id}
                        header={
                          <Space>
                            <Text strong>{category.name}</Text>
                            <Tag>Order: {category.orderIndex}</Tag>
                            <Tag>{category.sessions.length} sessions</Tag>
                          </Space>
                        }
                        extra={
                          <Space>
                            <Button
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategoryId(category.id);
                                setIsAddSessionModalVisible(true);
                              }}
                            >
                              Add Session
                            </Button>
                          </Space>
                        }
                      >
                        <List
                          dataSource={category.sessions}
                          renderItem={(session) => (
                            <List.Item
                              actions={[
                                <Button type="link" href={session.assetLink} target="_blank" icon={<EyeOutlined />}>
                                  View
                                </Button>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={renderAssetIcon(session.assetType)}
                                title={
                                  <Space>
                                    <Text>{session.title}</Text>
                                    {renderAssetTag(session.assetType)}
                                    <Tag>Order: {session.orderIndex}</Tag>
                                  </Space>
                                }
                                description={session.assetLink}
                              />
                            </List.Item>
                          )}
                          locale={{ emptyText: "No sessions in this category" }}
                        />
                      </Panel>
                    </Collapse>
                  ))}
                  {!course.categories?.length && (
                    <div style={{ textAlign: "center", padding: 20 }}>
                      <Text type="secondary">No categories added yet</Text>
                    </div>
                  )}
                </Card>
              </Space>
            </TabPane>

            {/* Enrollments Tab */}
            <TabPane tab={`Enrollments (${enrollments.length})`} key="enrollments">
              <Card>
                <Table
                  columns={enrollmentColumns}
                  dataSource={enrollments.map(enrollment => ({ 
                    key: enrollment.id, 
                    ...enrollment 
                  }))}
                  pagination={{ pageSize: 10 }}
                  locale={{ emptyText: "No enrollments yet" }}
                />
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      </Space>

      {/* Add Category Modal */}
      <Modal
        title="Add New Category"
        open={isAddCategoryModalVisible}
        onCancel={() => {
          setIsAddCategoryModalVisible(false);
          newCategoryForm.resetFields();
        }}
        footer={null}
      >
        <Form form={newCategoryForm} layout="vertical" onFinish={handleAddCategory}>
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item name="orderIndex" label="Order Index" rules={[{ required: true }]}>
            <InputNumber placeholder="Enter order index" min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Add Category</Button>
              <Button onClick={() => setIsAddCategoryModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Session Modal */}
      <Modal
        title="Add New Session"
        open={isAddSessionModalVisible}
        onCancel={() => {
          setIsAddSessionModalVisible(false);
          newSessionForm.resetFields();
        }}
        footer={null}
      >
        <Form form={newSessionForm} layout="vertical" onFinish={handleAddSession}>
          <Form.Item name="title" label="Session Title" rules={[{ required: true }]}>
            <Input placeholder="Enter session title" />
          </Form.Item>
          <Form.Item name="assetType" label="Asset Type" rules={[{ required: true }]}>
            <Select
              placeholder="Select asset type"
              options={[
                { value: "youtube", label: "YouTube Video" },
                { value: "web", label: "Web Link" },
                { value: "pdf", label: "PDF Document" },
                { value: "other", label: "Other" },
              ]}
            />
          </Form.Item>
          <Form.Item name="assetLink" label="Asset Link" rules={[{ required: true }]}>
            <Input placeholder="Enter asset URL" />
          </Form.Item>
          <Form.Item name="orderIndex" label="Order Index" rules={[{ required: true }]}>
            <InputNumber placeholder="Enter order index" min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Add Session</Button>
              <Button onClick={() => setIsAddSessionModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {contextHolder}
      {modalContextHolder}
    </div>
  );
}