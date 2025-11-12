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
  Popconfirm,
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
  courseId: string;
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
  const [isEditCourseModalVisible, setIsEditCourseModalVisible] =
    useState(false);
  const [editCourseForm] = Form.useForm();

  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState(false);
  const [isAddSessionModalVisible, setIsAddSessionModalVisible] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

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
      console.log("Fetched course details:", data.course);
    } catch (error) {
      messageApi.error("Failed to fetch course details");
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      console.log("Fetching enrollments for courseId:", courseId);
      const response = await fetch(`/api/courses/${courseId}/enrollments`);
      const data = await response.json();
      setEnrollments(data || []);
      console.log("Fetched enrollments:", data);
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

  // course edit handlers can be added here
  const handleEditCourse = () => {
    editCourseForm.setFieldsValue({
      name: course?.name,
      description: course?.description,
    });
    setIsEditCourseModalVisible(true);
  };
  const handleSaveCourse = async () => {
    if (!course) return;

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editCourseForm.getFieldValue("name"),
          description: editCourseForm.getFieldValue("description"),
        }),
      });

      if (response.ok) {
        messageApi.success("Course updated successfully!");
        const updatedCourse = await response.json();
        // update course state locally
        setCourse((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...updatedCourse,
          };
        });

      } else {
        messageApi.error("Failed to update course");
      }
    } catch (error) {
      messageApi.error("Failed to update course");
      console.error("Error updating course:", error);
    } finally {
      setIsEditCourseModalVisible(false);
    }
  };

  // Category CRUD Operations
  const handleAddCategory = async (values: {
    name: string;
    orderIndex: number;
  }) => {
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

  const handleEditCategory = (categoryId: string) => {
    setCourse((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                isEditing: true,
                tempName: cat.name,
                tempOrderIndex: cat.orderIndex,
              }
            : cat
        ),
      };
    });
  };

  const handleSaveCategory = async (categoryId: string) => {
    const category = course?.categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.tempName,
          orderIndex: category.tempOrderIndex,
        }),
      });

      if (response.ok) {
        messageApi.success("Category updated successfully!");
        fetchCourseDetails();
      } else {
        messageApi.error("Failed to update category");
      }
    } catch (error) {
      messageApi.error("Failed to update category");
      console.error("Error updating category:", error);
    }
  };

  const handleCancelEditCategory = (categoryId: string) => {
    setCourse((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId ? { ...cat, isEditing: false } : cat
        ),
      };
    });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        messageApi.success("Category deleted successfully!");
        fetchCourseDetails();
      } else {
        messageApi.error("Failed to delete category");
      }
    } catch (error) {
      messageApi.error("Failed to delete category");
      console.error("Error deleting category:", error);
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

  const handleEditSession = (categoryId: string, sessionId: string) => {
    setCourse((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                sessions: cat.sessions.map((session) =>
                  session.id === sessionId
                    ? {
                        ...session,
                        isEditing: true,
                        tempTitle: session.title,
                        tempAssetLink: session.assetLink,
                        tempAssetType: session.assetType,
                        tempOrderIndex: session.orderIndex,
                      }
                    : session
                ),
              }
            : cat
        ),
      };
    });
  };

  const handleSaveSession = async (categoryId: string, sessionId: string) => {
    const category = course?.categories.find((cat) => cat.id === categoryId);
    const session = category?.sessions.find((s) => s.id === sessionId);
    if (!session) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: session.tempTitle,
          assetLink: session.tempAssetLink,
          assetType: session.tempAssetType,
          orderIndex: session.tempOrderIndex,
        }),
      });

      if (response.ok) {
        messageApi.success("Session updated successfully!");
        fetchCourseDetails();
      } else {
        messageApi.error("Failed to update session");
      }
    } catch (error) {
      messageApi.error("Failed to update session");
      console.error("Error updating session:", error);
    }
  };

  const handleCancelEditSession = (categoryId: string, sessionId: string) => {
    setCourse((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                sessions: cat.sessions.map((session) =>
                  session.id === sessionId
                    ? { ...session, isEditing: false }
                    : session
                ),
              }
            : cat
        ),
      };
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        messageApi.success("Session deleted successfully!");
        fetchCourseDetails();
      } else {
        messageApi.error("Failed to delete session");
      }
    } catch (error) {
      messageApi.error("Failed to delete session");
      console.error("Error deleting session:", error);
    }
  };

  const renderAssetIcon = (assetType: string) => {
    switch (assetType) {
      case "youtube":
        return <PlayCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "web":
        return <LinkOutlined style={{ color: "#1890ff" }} />;
      case "pdf":
        return <FileTextOutlined style={{ color: "#52c41a" }} />;
      default:
        return <EyeOutlined />;
    }
  };

  const renderAssetTag = (assetType: string) => {
    const colors = {
      youtube: "red",
      web: "blue",
      pdf: "green",
      other: "default",
    };
    return (
      <Tag color={colors[assetType as keyof typeof colors]}>
        {assetType.toUpperCase()}
      </Tag>
    );
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
      title: "Sessions Completed",
      dataIndex: "completedSessions",
      key: "completedSessions",
      render: (completed: number, record: Enrollment) => (
        <Text>
          {completed} / {record.totalSessions}
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
            router.push(
              `/participants/${record.user.id}/course/${record.courseId}`
            )
          }
        >
          View Participant
        </Button>
      ),
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
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/courses")}
            >
              Back to Courses
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              {course.name}
            </Title>
            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditCourse()}>
                Edit Course
              </Button>
            </Space>
          </Space>
        </Card>

        {/* Statistics */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Enrollments"
                value={course._count?.enrollments || 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Categories"
                value={course.categories?.length || 0}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Sessions"
                value={
                  course.categories?.reduce(
                    (acc, cat) => acc + cat.sessions.length,
                    0
                  ) || 0
                }
              />
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
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="large"
              >
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
                          category.isEditing ? (
                            <Space>
                              <Input
                                value={category.tempName}
                                onChange={(e) =>
                                  setCourse((prev) => {
                                    if (!prev) return prev;
                                    return {
                                      ...prev,
                                      categories: prev.categories.map((cat) =>
                                        cat.id === category.id
                                          ? { ...cat, tempName: e.target.value }
                                          : cat
                                      ),
                                    };
                                  })
                                }
                                placeholder="Category name"
                                style={{ width: 200 }}
                              />
                              <InputNumber
                                value={category.tempOrderIndex}
                                onChange={(value) =>
                                  setCourse((prev) => {
                                    if (!prev) return prev;
                                    return {
                                      ...prev,
                                      categories: prev.categories.map((cat) =>
                                        cat.id === category.id
                                          ? {
                                              ...cat,
                                              tempOrderIndex: value || 1,
                                            }
                                          : cat
                                      ),
                                    };
                                  })
                                }
                                placeholder="Order"
                                min={1}
                                style={{ width: 100 }}
                              />
                            </Space>
                          ) : (
                            <Space>
                              <Text strong>{category.name}</Text>
                              <Tag>Order: {category.orderIndex}</Tag>
                              <Tag>{category.sessions.length} sessions</Tag>
                            </Space>
                          )
                        }
                        extra={
                          <Space>
                            {category.isEditing ? (
                              <>
                                <Button
                                  size="small"
                                  type="primary"
                                  icon={<SaveOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveCategory(category.id);
                                  }}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="small"
                                  icon={<CloseOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEditCategory(category.id);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
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
                                <Button
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCategory(category.id);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Popconfirm
                                  title="Delete Category"
                                  description="Are you sure you want to delete this category? All sessions in this category will also be deleted."
                                  onConfirm={(e) => {
                                    e?.stopPropagation();
                                    handleDeleteCategory(category.id);
                                  }}
                                  onCancel={(e) => e?.stopPropagation()}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Delete
                                  </Button>
                                </Popconfirm>
                              </>
                            )}
                          </Space>
                        }
                      >
                        <List
                          dataSource={category.sessions}
                          renderItem={(session) => (
                            <List.Item
                              actions={[
                                session.isEditing ? (
                                  <Space>
                                    <Button
                                      size="small"
                                      type="primary"
                                      icon={<SaveOutlined />}
                                      onClick={() =>
                                        handleSaveSession(
                                          category.id,
                                          session.id
                                        )
                                      }
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="small"
                                      icon={<CloseOutlined />}
                                      onClick={() =>
                                        handleCancelEditSession(
                                          category.id,
                                          session.id
                                        )
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  </Space>
                                ) : (
                                  <Space>
                                    <Button
                                      type="link"
                                      href={session.assetLink}
                                      target="_blank"
                                      icon={<EyeOutlined />}
                                    >
                                      View
                                    </Button>
                                    <Button
                                      size="small"
                                      icon={<EditOutlined />}
                                      onClick={() =>
                                        handleEditSession(
                                          category.id,
                                          session.id
                                        )
                                      }
                                    >
                                      Edit
                                    </Button>
                                    <Popconfirm
                                      title="Delete Session"
                                      description="Are you sure you want to delete this session?"
                                      onConfirm={() =>
                                        handleDeleteSession(session.id)
                                      }
                                      okText="Yes"
                                      cancelText="No"
                                    >
                                      <Button
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                      >
                                        Delete
                                      </Button>
                                    </Popconfirm>
                                  </Space>
                                ),
                              ]}
                            >
                              <List.Item.Meta
                                avatar={renderAssetIcon(session.assetType)}
                                title={
                                  session.isEditing ? (
                                    <Space
                                      direction="vertical"
                                      style={{ width: "100%" }}
                                    >
                                      <Input
                                        value={session.tempTitle}
                                        onChange={(e) =>
                                          setCourse((prev) => {
                                            if (!prev) return prev;
                                            return {
                                              ...prev,
                                              categories: prev.categories.map(
                                                (cat) =>
                                                  cat.id === category.id
                                                    ? {
                                                        ...cat,
                                                        sessions:
                                                          cat.sessions.map(
                                                            (s) =>
                                                              s.id ===
                                                              session.id
                                                                ? {
                                                                    ...s,
                                                                    tempTitle:
                                                                      e.target
                                                                        .value,
                                                                  }
                                                                : s
                                                          ),
                                                      }
                                                    : cat
                                              ),
                                            };
                                          })
                                        }
                                        placeholder="Session title"
                                      />
                                      <Select
                                        value={session.tempAssetType}
                                        onChange={(value) =>
                                          setCourse((prev) => {
                                            if (!prev) return prev;
                                            return {
                                              ...prev,
                                              categories: prev.categories.map(
                                                (cat) =>
                                                  cat.id === category.id
                                                    ? {
                                                        ...cat,
                                                        sessions:
                                                          cat.sessions.map(
                                                            (s) =>
                                                              s.id ===
                                                              session.id
                                                                ? {
                                                                    ...s,
                                                                    tempAssetType:
                                                                      value,
                                                                  }
                                                                : s
                                                          ),
                                                      }
                                                    : cat
                                              ),
                                            };
                                          })
                                        }
                                        options={[
                                          {
                                            value: "youtube",
                                            label: "YouTube Video",
                                          },
                                          { value: "web", label: "Web Link" },
                                          {
                                            value: "pdf",
                                            label: "PDF Document",
                                          },
                                          { value: "other", label: "Other" },
                                        ]}
                                        style={{ width: "100%" }}
                                      />
                                      <Input
                                        value={session.tempAssetLink}
                                        onChange={(e) =>
                                          setCourse((prev) => {
                                            if (!prev) return prev;
                                            return {
                                              ...prev,
                                              categories: prev.categories.map(
                                                (cat) =>
                                                  cat.id === category.id
                                                    ? {
                                                        ...cat,
                                                        sessions:
                                                          cat.sessions.map(
                                                            (s) =>
                                                              s.id ===
                                                              session.id
                                                                ? {
                                                                    ...s,
                                                                    tempAssetLink:
                                                                      e.target
                                                                        .value,
                                                                  }
                                                                : s
                                                          ),
                                                      }
                                                    : cat
                                              ),
                                            };
                                          })
                                        }
                                        placeholder="Asset URL"
                                      />
                                      <InputNumber
                                        value={session.tempOrderIndex}
                                        onChange={(value) =>
                                          setCourse((prev) => {
                                            if (!prev) return prev;
                                            return {
                                              ...prev,
                                              categories: prev.categories.map(
                                                (cat) =>
                                                  cat.id === category.id
                                                    ? {
                                                        ...cat,
                                                        sessions:
                                                          cat.sessions.map(
                                                            (s) =>
                                                              s.id ===
                                                              session.id
                                                                ? {
                                                                    ...s,
                                                                    tempOrderIndex:
                                                                      value ||
                                                                      1,
                                                                  }
                                                                : s
                                                          ),
                                                      }
                                                    : cat
                                              ),
                                            };
                                          })
                                        }
                                        placeholder="Order"
                                        min={1}
                                        style={{ width: "100%" }}
                                      />
                                    </Space>
                                  ) : (
                                    <Space>
                                      <Text>{session.title}</Text>
                                      {renderAssetTag(session.assetType)}
                                      <Tag>Order: {session.orderIndex}</Tag>
                                    </Space>
                                  )
                                }
                                description={
                                  session.isEditing ? null : session.assetLink
                                }
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
            <TabPane
              tab={`Enrollments (${enrollments.length})`}
              key="enrollments"
            >
              <Card>
                <Table
                  columns={enrollmentColumns}
                  dataSource={enrollments}
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
        <Form
          form={newCategoryForm}
          layout="vertical"
          onFinish={handleAddCategory}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            name="orderIndex"
            label="Order Index"
            rules={[{ required: true }]}
          >
            <InputNumber
              placeholder="Enter order index"
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Category
              </Button>
              <Button onClick={() => setIsAddCategoryModalVisible(false)}>
                Cancel
              </Button>
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
        <Form
          form={newSessionForm}
          layout="vertical"
          onFinish={handleAddSession}
        >
          <Form.Item
            name="title"
            label="Session Title"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter session title" />
          </Form.Item>
          <Form.Item
            name="assetType"
            label="Asset Type"
            rules={[{ required: true }]}
          >
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
          <Form.Item
            name="assetLink"
            label="Asset Link"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter asset URL" />
          </Form.Item>
          <Form.Item
            name="orderIndex"
            label="Order Index"
            rules={[{ required: true }]}
          >
            <InputNumber
              placeholder="Enter order index"
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Session
              </Button>
              <Button onClick={() => setIsAddSessionModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        title="Edit Course"
        open={isEditCourseModalVisible}
        onCancel={() => {
          setIsEditCourseModalVisible(false);
          editCourseForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={editCourseForm}
          layout="vertical"
          onFinish={handleSaveCourse}
        >
          <Form.Item
            name="name"
            initialValue={course?.name}
            label="Course Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>
          <Form.Item
            name="description"
            initialValue={course?.description}
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Enter course description" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
              <Button onClick={() => setIsEditCourseModalVisible(false)}>
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
