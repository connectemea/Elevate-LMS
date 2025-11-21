"use client";

import { Space, Card } from "antd";
import { Course } from "@/types";
import CourseInfo from "./CourseInfo";
import CategorySection from "./CategorySection";
import Button from "@/components/ui/Button";

interface Props {
  course: Course;
  onReload: () => void;

  onAddCategory: () => void;
  onEditCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;

  onAddSession: (categoryId: string) => void;
  onEditSession: (categoryId: string, sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}



export default function CourseDetailsTab(props: Props) {
 const { course, onReload } = props;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <CourseInfo course={course} />

      <Card
        title="Categories & Sessions"
        extra={
          <Button type="primary" onClick={props.onAddCategory}>
            Add Category
          </Button>
        }
      >
        {course.categories.length === 0 && (
          <div style={{ textAlign: "center", padding: 20 }}>No categories added yet</div>
        )}

        {course.categories.map((c) => (
          <CategorySection
            key={c.id}
            category={c}
            {...props}
          />
        ))}
      </Card>
    </Space>
  );
}
