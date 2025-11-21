// src/components/pages/CoursesPage/index.tsx
"use client";

import React, { useState } from "react";
import { Card, message, Modal } from "antd";
import { Title } from "@/components/antd";
import CourseTable from "./CourseTable";
import AddCourseModal from "./AddCourseModal";
import { useCourses } from "@/hooks/useCourses";
import Button from "@/components/ui/Button";

export default function CoursesPage() {
  const { data, isLoading, addCourse, deleteCourse, addCourseLoading } = useCourses();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [modal, modalContextHolder] = Modal.useModal();

  return (
    <div style={{ padding: 24 }}>
      {modalContextHolder}
      <Title level={2}>Courses Management</Title>

      <Card style={{ overflowX: "auto", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Button type="primary" onClick={() => setIsAddOpen(true)}>
            Add New Course
          </Button>
        </div>

        <CourseTable
          loading={isLoading}
          courses={data ?? []}
          onDelete={(id) =>
            modal.confirm({
              title: "Delete course?",
              content: "This will delete related data. Confirm?",
              okText: "Delete",
              okType: "danger",
              onOk: () => deleteCourse(id),
            })
          }
        />

        <div style={{ textAlign: "right", marginTop: 16 }}>
          Total Courses: {(data ?? []).length}
        </div>
      </Card>

      {/* Add course modal */}
      <AddCourseModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreate={(payload) => {
          addCourse(payload);
          setIsAddOpen(false);
        }}
        loading={addCourseLoading}
      />
    </div>
  );
}
