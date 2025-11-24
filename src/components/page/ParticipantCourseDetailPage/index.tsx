"use client";

import { Card, Space, Typography, Button, Spin, Result, message, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useParticipantCourse } from "@/hooks/useParticipantCourse";
import { useUpdateSessionProgress } from "@/hooks/useUpdateSessionProgress";
import CategoryPanel from "./CategoryPanel";
import { Category , Session } from "@/types";

const { Title, Paragraph } = Typography;

export default function ParticipantCourseDetail({ participantId, courseId }: { participantId: string; courseId: string }) {
  const router = useRouter();
  const [msg, ctx] = message.useMessage();

  const { participant, course, loading, refetchCourse } =
    useParticipantCourse(participantId, courseId);

  const updateProgress = useUpdateSessionProgress(participantId, courseId);

  const onUpdate = async (sessionId: string, status: "completed" | "in_progress") => {
    try {
      await updateProgress.mutateAsync({ sessionId, participantId, status });
      msg.success("Updated");
    } catch {
      msg.error("Failed");
    }
  };

  if (loading) {
    return (
      <div  style={{ height: "50vh" , display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!participant || !course) {
    return (
      <Result
        status="404"
        title="Not Found"
        subTitle="Participant or Course not found."
      />
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {ctx}

      <Card>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push(`/participants/${participantId}`)}
          >
            Back
          </Button>

          <Title level={3}>
            {participant.name} — {course.name}
          </Title>
        </Space>
      </Card>

      <Row gutter={16} style={{ margin: "16px 0" }}>
        <Col span={6}>
          <Card>
            <Title level={5}>Overall</Title>
            <div>{course.overallProgress ?? 0}%</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Title level={5}>Categories</Title>
            <div>{course.categories.length}</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Title level={5}>Total Sessions</Title>
            <div>
              {course.categories.reduce((a: number, c: Category) => a + c.sessions.length, 0)}
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Title level={5}>Completed</Title>
            <div>
              {course.categories.reduce(
                (a: number, c: Category) => a + c.sessions.filter((s: Session) => s.progress?.status === "completed").length,
                0
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Title level={4}>Description</Title>
        <Paragraph>{course.description}</Paragraph>
        <Button onClick={() => router.push(`/courses/${courseId}`)}>View Full Course</Button>
      </Card>

      <Card title="Course Content" style={{ marginTop: 16 }}>
        {course.categories.map((cat: Category) => (
          <CategoryPanel
            key={cat.id}
            category={cat}
            onUpdateSession={onUpdate}
            
          />
        ))}
      </Card>
    </div>
  );
}
