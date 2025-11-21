"use client";

import { Tabs, Card, Button, Space, Row, Col, Statistic } from "antd";
import { ArrowLeftOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import { useParticipantDetail } from "@/hooks/useParticipantDetail";
import { useParticipantActions } from "@/hooks/useParticipantActions";

import ParticipantInfo from "./sections/ParticipantInfo";
import EnrollmentTable from "./sections/EnrollmentTable";
import SessionProgressTable from "./sections/SessionProgressTable";

import EditParticipantModal from "./modals/EditParticipantModal";
import EnrollCourseModal from "./modals/EnrollCourseModal";

export default function ParticipantDetailPage({ participantId }: { participantId: string }) {
  const router = useRouter();

  const {
    participant,
    enrollments,
    progressHistory,
    stats,
    courses,
    loading,
    refetch,
  } = useParticipantDetail(participantId);

  const {
    openEditModal,
    openEnrollModal,
    closeEditModal,
    closeEnrollModal,
    handleEnrollCourse,
    handleUpdateParticipant,
    handleUnenroll,
    isEditModalOpen,
    isEnrollModalOpen,
  } = useParticipantActions(refetch);

  if (loading || !participant) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/participants")}>
              Back
            </Button>

            <h2><UserOutlined /> {participant.name}</h2>

            <Button type="primary" icon={<EditOutlined />} onClick={() => openEditModal(participant)}>
              Edit
            </Button>
          </Space>
        </Card>

        <Row gutter={16}>
          <Col span={8}><Card><Statistic title="Total Enrollments" value={stats.totalEnrollments} /></Card></Col>
          <Col span={8}><Card><Statistic title="Completed Courses" value={stats.completedCourses} /></Card></Col>
          <Col span={8}><Card><Statistic title="Avg Progress" value={stats.averageProgress} suffix="%" /></Card></Col>
        </Row>

        <Card>
          <Tabs defaultActiveKey="overview">
            <Tabs.TabPane tab="Overview" key="overview">
              <ParticipantInfo participant={participant} />

              <EnrollmentTable
                enrollments={enrollments}
                participantId={participantId}
                onUnenroll={handleUnenroll}
                onOpenEnroll={openEnrollModal}
              />
            </Tabs.TabPane>

            <Tabs.TabPane tab="Progress History" key="progress">
              <SessionProgressTable progress={progressHistory} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Space>

      <EditParticipantModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        participant={participant}
        onSubmit={handleUpdateParticipant}
      />

      <EnrollCourseModal
        open={isEnrollModalOpen}
        onClose={closeEnrollModal}
        courses={courses}
        onSubmit={handleEnrollCourse}
      />
    </div>
  );
}
