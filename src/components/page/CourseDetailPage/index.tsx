"use client";

import { Card, Spin, Result, message } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useCourseDetail } from "@/hooks/useCourseDetail";
import { enrollUsersInCourse } from "@/services/course.service";

import CourseHeader from "./CourseHeader";
import CourseStats from "./CourseStats";
import CourseTabs from "./CourseTabs";
import CourseDetailsTab from "./CourseDetailsTab";
import EnrollmentsTab from "./EnrollmentsTab";

import EditCourseModal from "./modals/EditCourseModal";
import AddCategoryModal from "./modals/AddCategoryModal";
import AddSessionModal from "./modals/AddSessionModal";
import AddEnrollmentModal from "./EnrollmentsTab/AddEnrollmentModal";

import { User, Category } from "@/types";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { course, enrollments, availableUsers, loading } =
    useCourseDetail(courseId);

  const [activeTab, setActiveTab] = useState("details");

  // UI states
  const [editCourseOpen, setEditCourseOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addSessionOpen, setAddSessionOpen] = useState(false);
  const [addEnrollmentOpen, setAddEnrollmentOpen] = useState(false);

  // Enrollment modal states
  const [searchText, setSearchText] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState(false);

  // filter logic
  const filteredUsers = useMemo(() => {
    if (!availableUsers) return [];

    return availableUsers.filter(
      (u: User) =>
        u.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, availableUsers]);

  // toggle users to enroll
  const handleToggleSelect = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // final enrollment mutation
  const handleBulkEnrollment = async () => {
    if (!selectedUserIds.length) return;

    try {
      setEnrolling(true);

      await enrollUsersInCourse(courseId, selectedUserIds);

      messageApi.success("Participants enrolled");

      // close modal
      setAddEnrollmentOpen(false);
      setSelectedUserIds([]);

      // refetch
      queryClient.invalidateQueries({ queryKey: ["enrollments", courseId] });
    } catch (err) {
      messageApi.error("Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <Result
        status="404"
        title="Course Not Found"
        subTitle="This course does not exist."
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <Card style={{ marginBottom: 16 }}>
        <CourseHeader
          name={course.name}
          onBack={() => router.push("/courses")}
          onEdit={() => setEditCourseOpen(true)}
        />
      </Card>

      <CourseStats
        totalEnrollments={course._count.enrollments}
        categoryCount={course.categories.length}
        totalSessions={course.categories.reduce(
          (sum: number, c: Category) => sum + c.sessions.length,
          0
        )}
        completionRate={75}
      />

      <Card>
        <CourseTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          enrollmentCount={enrollments.length}
          detailsTab={
            <CourseDetailsTab
              course={course}
              onReload={() => queryClient.invalidateQueries()}
              onAddCategory={() => setAddCategoryOpen(true)}
              onEditCategory={(id) => console.log("edit category", id)}
              onDeleteCategory={(id) => console.log("delete category", id)}
              onAddSession={(categoryId) => setAddSessionOpen(true)}
              onEditSession={(categoryId, sessionId) =>
                console.log("edit session", categoryId, sessionId)
              }
              onDeleteSession={(sessionId) =>
                console.log("delete session", sessionId)
              }
            />
          }
          enrollmentsTab={
            <EnrollmentsTab
              enrollments={enrollments}
              open={addEnrollmentOpen}
              onClose={() => setAddEnrollmentOpen(false)}
              onOpenModal={() => setAddEnrollmentOpen(true)}
              availableUsers={availableUsers}
              filteredUsers={filteredUsers}
              usersLoading={!availableUsers}
              searchText={searchText}
              selectedUserIds={selectedUserIds}
              enrolling={enrolling}
              onSearch={setSearchText}
              onToggleSelect={handleToggleSelect}
              onEnroll={handleBulkEnrollment}
            />
          }
        />
      </Card>

      {/* Modals */}
      <EditCourseModal
        open={editCourseOpen}
        onClose={() => setEditCourseOpen(false)}
        course={course}
        onUpdated={() => queryClient.invalidateQueries()}
      />

      <AddCategoryModal
        open={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        courseId={courseId}
        onAdded={() => queryClient.invalidateQueries()}
      />

      <AddSessionModal
        open={addSessionOpen}
        onClose={() => setAddSessionOpen(false)}
        courseId={courseId}
        onAdded={() => queryClient.invalidateQueries()}
      />

      {/* ENROLLMENT MODAL FIXED */}
      <AddEnrollmentModal
        open={addEnrollmentOpen}
        onClose={() => setAddEnrollmentOpen(false)}
        filteredUsers={filteredUsers}
        usersLoading={!availableUsers}
        searchText={searchText}
        selectedUserIds={selectedUserIds}
        enrolling={enrolling}
        onSearch={setSearchText}
        onToggleSelect={handleToggleSelect}
        onEnroll={handleBulkEnrollment}
      />
    </div>
  );
}
