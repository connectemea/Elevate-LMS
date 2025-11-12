"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Form,
  InputNumber,
  Modal,
  message,
  Tag,
  Select,
  Collapse,
  List,
  Typography,
  Divider,
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
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

// Types based on your Prisma schema
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
  categoryId?: string;
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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddCourseModalVisible, setIsAddCourseModalVisible] = useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState(false);
  const [isAddSessionModalVisible, setIsAddSessionModalVisible] =
    useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [newCourseForm] = Form.useForm();
  const [newCategoryForm] = Form.useForm();
  const [newSessionForm] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, contextHolder2] = message.useMessage();
  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      const data = await response.json();
      setCourses(data.courses || []);
      console.log("Fetched courses:", data);
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

  // --- Course CRUD Operations (keep existing functions)
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

  const handleEditCourse = (courseId: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              isEditing: true,
              tempName: course.name,
              tempDescription: course.description,
            }
          : course
      )
    );
  };

  const handleSaveCourse = async (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: course.tempName || course.name,
          description: course.tempDescription || course.description,
        }),
      });

      if (response.ok) {
        messageApi.success("Course updated successfully!");
        fetchCourses();
      } else {
        messageApi.error("Failed to update course");
      }
    } catch (error) {
      messageApi.error("Failed to update course");
      console.error("Error updating course:", error);
    }
  };

  const handleCancelCourseEdit = (courseId: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, isEditing: false } : course
      )
    );
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

  // --- Category CRUD Operations (keep existing functions)
  const handleAddCategory = async (values: {
    name: string;
    orderIndex: number;
  }) => {
    if (!selectedCourseId) return;

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          courseId: selectedCourseId,
        }),
      });

      if (response.ok) {
        messageApi.success("Category added successfully!");
        setIsAddCategoryModalVisible(false);
        newCategoryForm.resetFields();
        fetchCourses();
      } else {
        messageApi.error("Failed to add category");
      }
    } catch (error) {
      messageApi.error("Failed to add category");
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = (courseId: string, categoryId: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              categories: course.categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      isEditing: true,
                      tempName: cat.name,
                      tempOrderIndex: cat.orderIndex,
                    }
                  : cat
              ),
            }
          : course
      )
    );
  };

  const handleSaveCategory = async (courseId: string, categoryId: string) => {
    const course = courses.find((c) => c.id === courseId);
    const category = course?.categories.find((cat) => cat.id === categoryId);

    if (!category) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: category.tempName || category.name,
          orderIndex: category.tempOrderIndex || category.orderIndex,
        }),
      });

      if (response.ok) {
        messageApi.success("Category updated successfully!");
        fetchCourses();
      } else {
        messageApi.error("Failed to update category");
      }
    } catch (error) {
      messageApi.error("Failed to update category");
      console.error("Error updating category:", error);
    }
  };

  const handleCancelCategoryEdit = (courseId: string, categoryId: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              categories: course.categories.map((cat) =>
                cat.id === categoryId ? { ...cat, isEditing: false } : cat
              ),
            }
          : course
      )
    );
  };

  const handleDeleteCategory = async (courseId: string, categoryId: string) => {
    modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "All sessions in this category will also be deleted.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const response = await fetch(`/api/categories/${categoryId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            messageApi.success("Category deleted successfully!");
            fetchCourses();
          } else {
            messageApi.error("Failed to delete category");
          }
        } catch (error) {
          messageApi.error("Failed to delete category");
          console.error("Error deleting category:", error);
        }
      },
    });
  };

  // --- Session CRUD Operations
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          categoryId: selectedCategoryId,
        }),
      });

      if (response.ok) {
        messageApi.success("Session added successfully!");
        setIsAddSessionModalVisible(false);
        newSessionForm.resetFields();
        fetchCourses();
      } else {
        messageApi.error("Failed to add session");
      }
    } catch (error) {
      messageApi.error("Failed to add session");
      console.error("Error adding session:", error);
    }
  };

  const handleEditSession = (
    courseId: string,
    categoryId: string,
    sessionId: string
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              categories: course.categories.map((cat) =>
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
            }
          : course
      )
    );
  };

  const handleSaveSession = async (
    courseId: string,
    categoryId: string,
    sessionId: string
  ) => {
    const course = courses.find((c) => c.id === courseId);
    const category = course?.categories.find((cat) => cat.id === categoryId);
    const session = category?.sessions.find((sess) => sess.id === sessionId);

    if (!session) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: session.tempTitle || session.title,
          assetLink: session.tempAssetLink || session.assetLink,
          assetType: session.tempAssetType || session.assetType,
          orderIndex: session.tempOrderIndex || session.orderIndex,
        }),
      });

      if (response.ok) {
        messageApi.success("Session updated successfully!");
        fetchCourses();
      } else {
        messageApi.error("Failed to update session");
      }
    } catch (error) {
      messageApi.error("Failed to update session");
      console.error("Error updating session:", error);
    }
  };

  const handleCancelSessionEdit = (
    courseId: string,
    categoryId: string,
    sessionId: string
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              categories: course.categories.map((cat) =>
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
            }
          : course
      )
    );
  };

  const handleDeleteSession = async (
    courseId: string,
    categoryId: string,
    sessionId: string
  ) => {
    modal.confirm({
      title: "Are you sure you want to delete this session?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const response = await fetch(`/api/sessions/${sessionId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            messageApi.success("Session deleted successfully!");
            fetchCourses();
          } else {
            messageApi.error("Failed to delete session");
          }
        } catch (error) {
          messageApi.error("Failed to delete session");
          console.error("Error deleting session:", error);
        }
      },
    });
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

  // --- Column Definitions (keep existing columns)
  const columns = [
    {
      title: "Course Name",
      dataIndex: "name",
      render: (name: string, record: Course) => {
        if (record.isEditing) {
          return (
            <Input
              value={record.tempName}
              onChange={(e) =>
                setCourses(
                  courses.map((c) =>
                    c.id === record.id ? { ...c, tempName: e.target.value } : c
                  )
                )
              }
              placeholder="Course name"
            />
          );
        }
        return <strong>{name}</strong>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      render: (description: string, record: Course) => {
        if (record.isEditing) {
          return (
            <Input.TextArea
              value={record.tempDescription}
              onChange={(e) =>
                setCourses(
                  courses.map((c) =>
                    c.id === record.id
                      ? { ...c, tempDescription: e.target.value }
                      : c
                  )
                )
              }
              placeholder="Course description"
              rows={2}
            />
          );
        }
        return description || "No description";
      },
    },
    {
      title: "Enrolled",
      dataIndex: ["_count", "enrollments"],
      align: "center" as const,
      render: (enrolled: number) => (
        <span style={{ fontWeight: "bold", color: "#1890ff" }}>
          {enrolled || 0}
        </span>
      ),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      align: "center" as const,
      render: (categories: Category[]) => categories?.length || 0,
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: Course) => {
        const isEditing = record.isEditing;

        return (
          <Space>
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  size="small"
                  icon={<SaveOutlined />}
                  onClick={() => handleSaveCourse(record.id)}
                >
                  Save
                </Button>
                <Button
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleCancelCourseEdit(record.id)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditCourse(record.id)}
                >
                  Edit
                </Button>
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteCourse(record.id)}
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

  // --- Expanded Row Render for Categories and Sessions
  const expandedRowRender = (course: Course) => {
    const categoryColumns = [
      {
        title: "Order",
        dataIndex: "orderIndex",
        width: 100,
        render: (orderIndex: number, record: Category, index: number) => {
          if (record.isEditing) {
            return (
              <InputNumber
                value={record.tempOrderIndex}
                onChange={(value) =>
                  setCourses(
                    courses.map((c) =>
                      c.id === course.id
                        ? {
                            ...c,
                            categories: c.categories.map((cat, idx) =>
                              idx === index
                                ? { ...cat, tempOrderIndex: value || 0 }
                                : cat
                            ),
                          }
                        : c
                    )
                  )
                }
                min={1}
                style={{ width: "80px" }}
              />
            );
          }
          return orderIndex;
        },
      },
      {
        title: "Category Name",
        dataIndex: "name",
        render: (name: string, record: Category, index: number) => {
          if (record.isEditing) {
            return (
              <Input
                value={record.tempName}
                onChange={(e) =>
                  setCourses(
                    courses.map((c) =>
                      c.id === course.id
                        ? {
                            ...c,
                            categories: c.categories.map((cat, idx) =>
                              idx === index
                                ? { ...cat, tempName: e.target.value }
                                : cat
                            ),
                          }
                        : c
                    )
                  )
                }
                placeholder="Category name"
              />
            );
          }
          return name;
        },
      },
      {
        title: "Sessions",
        dataIndex: "sessions",
        align: "center" as const,
        render: (sessions: Session[]) => sessions?.length || 0,
      },
      {
        title: "Actions",
        key: "actions",
        width: 200,
        render: (_: any, record: Category) => {
          const isEditing = record.isEditing;

          return (
            <Space size="small">
              {isEditing ? (
                <>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleSaveCategory(course.id, record.id)}
                  >
                    Save
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={() =>
                      handleCancelCategoryEdit(course.id, record.id)
                    }
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEditCategory(course.id, record.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setSelectedCategoryId(record.id);
                      setIsAddSessionModalVisible(true);
                    }}
                  >
                    Add Session
                  </Button>
                  <Button
                    type="link"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteCategory(course.id, record.id)}
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

    const sessionColumns = [
      {
        title: "Order",
        dataIndex: "orderIndex",
        width: 80,
        render: (orderIndex: number, record: Session, sessionIndex: number) => {
          if (record.isEditing) {
            return (
              <InputNumber
                value={record.tempOrderIndex}
                onChange={(value) =>
                  setCourses(
                    courses.map((c) =>
                      c.id === course.id
                        ? {
                            ...c,
                            categories: c.categories.map((cat) =>
                              cat.id === record.categoryId
                                ? {
                                    ...cat,
                                    sessions: cat.sessions.map((sess, idx) =>
                                      sessionIndex === idx
                                        ? {
                                            ...sess,
                                            tempOrderIndex: value || 0,
                                          }
                                        : sess
                                    ),
                                  }
                                : cat
                            ),
                          }
                        : c
                    )
                  )
                }
                min={1}
                style={{ width: "60px" }}
              />
            );
          }
          return orderIndex;
        },
      },
      {
        title: "Session Title",
        dataIndex: "title",
        render: (title: string, record: Session, sessionIndex: number) => {
          if (record.isEditing) {
            return (
              <Input
                value={record.tempTitle}
                onChange={(e) =>
                  setCourses(
                    courses.map((c) =>
                      c.id === course.id
                        ? {
                            ...c,
                            categories: c.categories.map((cat) =>
                              cat.id === record.categoryId
                                ? {
                                    ...cat,
                                    sessions: cat.sessions.map((sess, idx) =>
                                      sessionIndex === idx
                                        ? { ...sess, tempTitle: e.target.value }
                                        : sess
                                    ),
                                  }
                                : cat
                            ),
                          }
                        : c
                    )
                  )
                }
                placeholder="Session title"
              />
            );
          }
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {renderAssetIcon(record.assetType)}
              <Text>{title}</Text>
            </div>
          );
        },
      },
      {
        title: "Type",
        dataIndex: "assetType",
        width: 100,
        render: (assetType: string, record: Session, sessionIndex: number) => {
          if (record.isEditing) {
            return (
              <Select
                value={record.tempAssetType || assetType}
                onChange={(value) =>
                  setCourses(
                    courses.map((c) =>
                      c.id === course.id
                        ? {
                            ...c,
                            categories: c.categories.map((cat) =>
                              cat.id === record.categoryId
                                ? {
                                    ...cat,
                                    sessions: cat.sessions.map((sess, idx) =>
                                      sessionIndex === idx
                                        ? { ...sess, tempAssetType: value }
                                        : sess
                                    ),
                                  }
                                : cat
                            ),
                          }
                        : c
                    )
                  )
                }
                style={{ width: "100%" }}
                options={[
                  { value: "youtube", label: "YouTube" },
                  { value: "web", label: "Web" },
                  { value: "pdf", label: "PDF" },
                  { value: "other", label: "Other" },
                ]}
              />
            );
          }
          return renderAssetTag(assetType);
        },
      },
      {
        title: "Asset Link",
        dataIndex: "assetLink",
        render: (assetLink: string, record: Session, sessionIndex: number) => {
          if (record.isEditing) {
            return (
              <Input
                value={record.tempAssetLink}
                onChange={(e) =>
                  setCourses(
                    courses.map((c) =>
                      c.id === course.id
                        ? {
                            ...c,
                            categories: c.categories.map((cat) =>
                              cat.id === record.categoryId
                                ? {
                                    ...cat,
                                    sessions: cat.sessions.map((sess, idx) =>
                                      sessionIndex === idx
                                        ? {
                                            ...sess,
                                            tempAssetLink: e.target.value,
                                          }
                                        : sess
                                    ),
                                  }
                                : cat
                            ),
                          }
                        : c
                    )
                  )
                }
                placeholder="Asset URL"
              />
            );
          }
          return (
            <Button
              type="link"
              size="small"
              href={assetLink}
              target="_blank"
              icon={<EyeOutlined />}
            >
              View
            </Button>
          );
        },
      },
      {
        title: "Actions",
        key: "actions",
        width: 150,
        render: (_: any, record: Session) => {
          const isEditing = record.isEditing;
          const category = course.categories.find((cat) =>
            cat.sessions.some((s) => s.id === record.id)
          );

          return (
            <Space size="small">
              {isEditing ? (
                <>
                  <Button
                    type="link"
                    size="small"
                    onClick={() =>
                      handleSaveSession(course.id, category?.id!, record.id)
                    }
                  >
                    Save
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={() =>
                      handleCancelSessionEdit(
                        course.id,
                        category?.id!,
                        record.id
                      )
                    }
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() =>
                      handleEditSession(course.id, category?.id!, record.id)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    type="link"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      handleDeleteSession(course.id, category?.id!, record.id)
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

    return (
      <div>
        {/* Categories Section */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4>Course Categories</h4>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedCourseId(course.id);
                setIsAddCategoryModalVisible(true);
              }}
            >
              Add Category
            </Button>
          </div>
          <Table
            columns={categoryColumns}
            dataSource={
              course.categories?.map((cat) => ({ key: cat.id, ...cat })) || []
            }
            pagination={false}
            size="small"
            bordered
            expandable={{
              expandedRowRender: (category: Category) => (
                <div style={{ margin: 0 }}>
                  <div
                    style={{
                      marginBottom: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h5>Sessions in {category.name}</h5>
                    <Button
                      type="dashed"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setIsAddSessionModalVisible(true);
                      }}
                    >
                      Add Session
                    </Button>
                  </div>
                  <Table
                    columns={sessionColumns}
                    dataSource={
                      category.sessions?.map((sess) => ({
                        key: sess.id,
                        ...sess,
                        categoryId: category.id,
                      })) || []
                    }
                    pagination={false}
                    size="small"
                    bordered
                    locale={{ emptyText: "No sessions yet" }}
                  />
                </div>
              ),
              rowExpandable: (category) => true,
            }}
            locale={{ emptyText: "No categories yet" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Course Management</Title>

      <Card>
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
          columns={columns}
          dataSource={courses.map((course) => ({ key: course.id, ...course }))}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => true,
          }}
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
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            name="orderIndex"
            label="Order Index"
            rules={[{ required: true, message: "Please enter order index" }]}
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
            rules={[{ required: true, message: "Please enter session title" }]}
          >
            <Input placeholder="Enter session title" />
          </Form.Item>
          <Form.Item
            name="assetType"
            label="Asset Type"
            rules={[{ required: true, message: "Please select asset type" }]}
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
            rules={[{ required: true, message: "Please enter asset link" }]}
          >
            <Input placeholder="Enter asset URL" />
          </Form.Item>
          <Form.Item
            name="orderIndex"
            label="Order Index"
            rules={[{ required: true, message: "Please enter order index" }]}
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

      {contextHolder}
      {contextHolder2}
    </div>
  );
}
