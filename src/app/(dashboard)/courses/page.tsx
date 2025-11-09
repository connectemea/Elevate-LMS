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
} from "antd";
import { Title } from "@/components/antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";

// Types based on your Prisma schema
interface Category {
  id: string;
  name: string;
  orderIndex: number;
  isEditing?: boolean;
  tempName?: string;
  tempOrderIndex?: number;
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
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [newCourseForm] = Form.useForm();
  const [newCategoryForm] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      message.error("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();

  }, []);

  // --- Course CRUD Operations
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
        message.success("Course added successfully!");
        setIsAddCourseModalVisible(false);
        newCourseForm.resetFields();
        fetchCourses(); // Refresh the list
      } else {
        message.error("Failed to add course");
      }
    } catch (error) {
      message.error("Failed to add course");
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
    console.log("Attempting to save course ID:", courseId);
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
        message.success("Course updated successfully!");
        fetchCourses(); // Refresh the list
      } else {
        message.error("Failed to update course");
      }
    } catch (error) {
      message.error("Failed to update course");
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
    console.log("Attempting to delete course ID:", courseId);
    modal.confirm({
      title: "Are you sure you want to delete this course?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const response = await fetch(`/api/courses/${courseId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            message.success("Course deleted successfully!");
            fetchCourses(); // Refresh the list
          } else {
            message.error("Failed to delete course");
          }
        } catch (error) {
          message.error("Failed to delete course");
          console.error("Error deleting course:", error);
        }
      },
    });
  };

  // --- Category CRUD Operations
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
        message.success("Category added successfully!");
        setIsAddCategoryModalVisible(false);
        newCategoryForm.resetFields();
        fetchCourses(); // Refresh the list
      } else {
        message.error("Failed to add category");
      }
    } catch (error) {
      message.error("Failed to add category");
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
        message.success("Category updated successfully!");
        fetchCourses(); // Refresh the list
      } else {
        message.error("Failed to update category");
      }
    } catch (error) {
      message.error("Failed to update category");
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
            message.success("Category deleted successfully!");
            fetchCourses(); // Refresh the list
          } else {
            message.error("Failed to delete category");
          }
        } catch (error) {
          message.error("Failed to delete category");
          console.error("Error deleting category:", error);
        }
      },
    });
  };

  // --- Column Definitions
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

  // --- Expanded Row Render for Categories
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
        title: "Actions",
        key: "actions",
        width: 150,
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

    return (
      <div>
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
          locale={{ emptyText: "No categories yet" }}
        />
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

      {contextHolder}
    </div>
  );
}
