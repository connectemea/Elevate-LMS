"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Divider,
  Collapse,
  Badge,
  Checkbox,
  List,
  Progress,
  message,
  Row,
  Col,
  Statistic,
  Spin,
  Result,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface SessionProgress {
  id: string;
  sessionId: string;
  sessionTitle: string;
  status: "in_progress" | "completed";
  updatedAt: string;
  assetType?: string;
  assetLink?: string;
}

interface CourseDetail {
  id: string;
  name: string;
  description: string;
  categories: CategoryDetail[];
  overallProgress?: number;
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

interface Participant {
  id: string;
  name: string;
  email: string;
}

export default function ParticipantCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const participantId = params.id as string;
  const courseId = params.courseId as string;

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchParticipantDetails = async () => {
    try {
      const response = await fetch(`/api/participants/${participantId}`);
      const data = await response.json();
      setParticipant(data.participant);
    } catch (error) {
      messageApi.error("Failed to fetch participant details");
      console.error("Error fetching participant:", error);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}?participantId=${participantId}`
      );
      const data = await response.json();

      if (data.course) {
        setCourseDetails(data.course);
      } else {
        messageApi.error("Course not found");
      }
    } catch (error) {
      messageApi.error("Failed to fetch course details");
      console.error("Error fetching course details:", error);
    }
  };

  useEffect(() => {
    if (!participantId || !courseId) return;

    setLoading(true);

    Promise.all([fetchParticipantDetails(), fetchCourseDetails()])
      .catch(() => {
        messageApi.error("Failed to load participant or course data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [participantId, courseId]);

  const handleUpdateSessionProgress = async (
    sessionId: string,
    status: "in_progress" | "completed"
  ) => {
    setUpdatingProgress(sessionId);
    try {
      const response = await fetch("/api/session-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          participantId,
          status,
        }),
      });

      if (response.ok) {
        messageApi.success(`Session marked as ${status.replace("_", " ")}`);
        fetchCourseDetails(); // Refresh course details to get updated progress
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

  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <Spin size="large" />
        <br />
        <p style={{ padding: 16 }}>Loading course details...</p>
      </div>
    );
  }

  if (!courseDetails || !participant) {
    return (
      <div style={{ padding: 40 }}>
        <Result
          status="404"
          title="Course or participant Not Found"
          subTitle="The course or participant you're looking for does not exist or has been removed."
        />
      </div>
    );
  }

  const calculateCategoryProgress = (sessions: SessionDetail[]) => {
    if (!sessions || sessions.length === 0) return 0;

    const completed = sessions.filter(
      (s) => s.progress?.status === "completed"
    ).length;
    return (completed / sessions.length) * 100;
  };

  const calculateTotalSessions = () => {
    if (!courseDetails?.categories) return 0;
    return courseDetails.categories.reduce(
      (acc, cat) => acc + (cat.sessions?.length || 0),
      0
    );
  };

  const calculateCompletedSessions = () => {
    if (!courseDetails?.categories) return 0;
    return courseDetails.categories.reduce(
      (acc, cat) =>
        acc +
        (cat.sessions?.filter((s) => s.progress?.status === "completed")
          .length || 0),
      0
    );
  };

  if (!courseDetails || !participant) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Title level={3}>Course or participant not found</Title>
        <Button
          type="primary"
          onClick={() => router.push(`/participants/${participantId}`)}
        >
          Back to Participant
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* Header */}
        <Card>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push(`/participants/${participantId}`)}
            >
              Back to Participant
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              <UserOutlined /> {participant.name} - {courseDetails.name}
            </Title>
          </Space>
        </Card>

        {/* Course Statistics */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Overall Progress"
                value={courseDetails.overallProgress || 0}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Categories"
                value={courseDetails.categories?.length || 0}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Sessions"
                value={calculateTotalSessions()}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Completed Sessions"
                value={calculateCompletedSessions()}
              />
            </Card>
          </Col>
        </Row>

        {/* Course Description */}
        <Card>
          <Title level={4}>Course Description</Title>
          <Paragraph>{courseDetails.description}</Paragraph>
          {/* view course button */}
          <Button
            type="primary"
            onClick={() => router.push(`/courses/${courseDetails.id}`)}
          >
            View Course Details
          </Button>
        </Card>

        {/* Course Content */}
        {/* Course Content */}
        <Card title="Course Content">
          {courseDetails.categories?.length > 0 ? (
            <Collapse defaultActiveKey={["0"]}>
              {courseDetails.categories.map((category) => {
                const categoryProgress = calculateCategoryProgress(
                  category.sessions
                );

                return (
                  <Panel
                    header={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Text strong>{category.name}</Text>
                        <Space>
                          <Progress
                            percent={Math.round(categoryProgress)}
                            size="small"
                            style={{ width: 100, margin: 0 }}
                          />
                          <Badge
                            count={
                              category.sessions.filter(
                                (s) => s?.progress?.status === "completed"
                              ).length +
                              "/" +
                              category.sessions.length
                            }
                            style={{ backgroundColor: "#52c41a" }}
                          />
                        </Space>
                      </div>
                    }
                    key={category.id}
                  >
                    <List
                      dataSource={category.sessions.sort(
                        (a, b) => a.orderIndex - b.orderIndex
                      )}
                      renderItem={(session) => (
                        <List.Item
                          actions={[
                            <div
                              key="status"
                              style={{ width: 140, textAlign: "right" }}
                            >
                              <Checkbox
                                checked={
                                  session?.progress?.status === "completed"
                                }
                                disabled={updatingProgress === session.id}
                                onChange={(e) =>
                                  handleUpdateSessionProgress(
                                    session.id,
                                    e.target.checked
                                      ? "completed"
                                      : "in_progress"
                                  )
                                }
                              >
                                <Text
                                  type={
                                    session.progress?.status === "completed"
                                      ? "success"
                                      : "secondary"
                                  }
                                >
                                  {session.progress?.status === "completed"
                                    ? "Completed"
                                    : "Mark Complete"}
                                </Text>
                              </Checkbox>
                            </div>,
                            renderAssetLink(session),
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              session.progress?.status === "completed" ? (
                                <CheckCircleOutlined
                                  style={{ color: "#52c41a", fontSize: 16 }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: 16,
                                    height: 16,
                                    border: "2px solid #d9d9d9",
                                    borderRadius: 2,
                                  }}
                                />
                              )
                            }
                            title={session.title}
                            description={
                              <Text type="secondary">
                                {session.assetType?.toUpperCase()} • Order:{" "}
                                {session.orderIndex}
                                {session.progress?.updatedAt && (
                                  <>
                                    {" "}
                                    • Last updated:{" "}
                                    {new Date(
                                      session.progress.updatedAt
                                    ).toLocaleDateString()}
                                  </>
                                )}
                              </Text>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Panel>
                );
              })}
            </Collapse>
          ) : (
            <div style={{ textAlign: "center", padding: 20 }}>
              <Text type="secondary">
                No content available for this course.
              </Text>
            </div>
          )}

          {/* Overall Progress Summary */}
          <div
            style={{
              marginTop: 24,
              padding: 16,
              background: "#f5f5f5",
              borderRadius: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text strong>Overall Course Progress</Text>
              <Text strong type="success">
                {courseDetails.overallProgress
                  ? Math.round(courseDetails.overallProgress)
                  : 0}
                %
              </Text>
            </div>
            <Progress
              percent={
                courseDetails.overallProgress
                  ? Math.round(courseDetails.overallProgress)
                  : 0
              }
              status={
                courseDetails.overallProgress === 100 ? "success" : "active"
              }
            />
          </div>
        </Card>
      </Space>
    </div>
  );
}
