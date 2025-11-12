"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Card, 
  Form, 
  Modal, 
  message, 
  Tag,
  Select,
  Progress,
  Badge,
  Checkbox,
  List,
  Typography,
  Divider,
  Collapse
} from "antd";
import { Title } from "@/components/antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  SaveOutlined, 
  CloseOutlined,
  EyeOutlined,
  UserOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  progress: number;
  enrolledAt: string;
}

interface SessionProgress {
  id: string;
  sessionId: string;
  sessionTitle: string;
  status: 'in_progress' | 'completed';
  updatedAt: string;
  assetType?: string;
  assetLink?: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  year: number;
  createdAt: string;
  enrollments: Enrollment[];
  sessionProgress: SessionProgress[];
  isEditing?: boolean;
  tempName?: string;
  tempEmail?: string;
  tempYear?: number;
}

interface CourseDetail {
  id: string;
  name: string;
  description: string;
  categories: CategoryDetail[];
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

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddParticipantModalVisible, setIsAddParticipantModalVisible] = useState(false);
  const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
  const [isProgressModalVisible, setIsProgressModalVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [searchText, setSearchText] = useState("");
  const [newParticipantForm] = Form.useForm();
  const [enrollForm] = Form.useForm();
  const [courses, setCourses] = useState<any[]>([]);
  const [courseDetails, setCourseDetails] = useState<CourseDetail | null>(null);
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);
  const [modal, contextHolder] = Modal.useModal();
const [messageApi, contextHolder2] = message.useMessage();
  // Fetch participants and courses
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/participants');
      const data = await response.json();
      setParticipants(data.participants || []);
    } catch (error) {
      messageApi.error('Failed to fetch participants');
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchCourseDetails = async (courseId: string, participantId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}?participantId=${participantId}`);
      const data = await response.json();
      setCourseDetails(data.course);
    } catch (error) {
      messageApi.error('Failed to fetch course details');
      console.error('Error fetching course details:', error);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchCourses();
  }, []);

  // --- Session Progress Operations
  const handleUpdateSessionProgress = async (sessionId: string, status: 'in_progress' | 'completed') => {
    if (!selectedParticipant) return;

    setUpdatingProgress(sessionId);
    try {
      const response = await fetch('/api/session-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          participantId: selectedParticipant.id,
          status,
        }),
      });

      if (response.ok) {
        messageApi.success(`Session marked as ${status.replace('_', ' ')}`);
        // Refresh data
        if (selectedEnrollment) {
          fetchCourseDetails(selectedEnrollment.courseId, selectedParticipant.id);
        }
        fetchParticipants();
      } else {
        messageApi.error("Failed to update session progress");
      }
    } catch (error) {
      messageApi.error("Failed to update session progress");
      console.error('Error updating session progress:', error);
    } finally {
      setUpdatingProgress(null);
    }
  };

  const handleViewProgress = (participant: Participant, enrollment: Enrollment) => {
    setSelectedParticipant(participant);
    setSelectedEnrollment(enrollment);
    setIsProgressModalVisible(true);
    fetchCourseDetails(enrollment.courseId, participant.id);
  };

  const renderAssetLink = (session: SessionDetail) => {
    if (!session.assetLink) return null;

    switch (session.assetType) {
      case 'youtube':
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
      case 'pdf':
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
      case 'web':
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

   // --- Participant CRUD Operations
   const handleAddParticipant = async (values: { name: string; email: string; year: number }) => {
     try {
       const response = await fetch('/api/participants', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(values),
       });
 
       if (response.ok) {
         messageApi.success("Participant added successfully!");
         setIsAddParticipantModalVisible(false);
         newParticipantForm.resetFields();
         fetchParticipants();
       } else {
         messageApi.error("Failed to add participant");
       }
     } catch (error) {
       messageApi.error("Failed to add participant");
       console.error('Error adding participant:', error);
     }
   };
 
   const handleEditParticipant = (participantId: string) => {
     setParticipants(participants.map(participant => 
       participant.id === participantId 
         ? { 
             ...participant, 
             isEditing: true, 
             tempName: participant.name, 
             tempEmail: participant.email,
             tempYear: participant.year
           }
         : participant
     ));
   };
 
   const handleSaveParticipant = async (participantId: string) => {
     const participant = participants.find(p => p.id === participantId);
     if (!participant) return;
 
     try {
       const response = await fetch(`/api/participants/${participantId}`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           name: participant.tempName || participant.name,
           email: participant.tempEmail || participant.email,
           year: participant.tempYear || participant.year,
         }),
       });
 
       if (response.ok) {
         messageApi.success("Participant updated successfully!");
         fetchParticipants();
       } else {
         messageApi.error("Failed to update participant");
       }
     } catch (error) {
       messageApi.error("Failed to update participant");
       console.error('Error updating participant:', error);
     }
   };
 
   const handleCancelParticipantEdit = (participantId: string) => {
     setParticipants(participants.map(participant => 
       participant.id === participantId 
         ? { ...participant, isEditing: false }
         : participant
     ));
   };
 
   const handleDeleteParticipant = async (participantId: string) => {
     modal.confirm({
       title: "Are you sure you want to delete this participant?",
       content: "All their enrollments and progress will also be deleted.",
       okText: "Yes, Delete",
       okType: "danger",
       cancelText: "Cancel",
       async onOk() {
         try {
           const response = await fetch(`/api/participants/${participantId}`, {
             method: 'DELETE',
           });
 
           if (response.ok) {
             messageApi.success("Participant deleted successfully!");
             fetchParticipants();
           } else {
             messageApi.error("Failed to delete participant");
           }
         } catch (error) {
           messageApi.error("Failed to delete participant");
           console.error('Error deleting participant:', error);
         }
       },
     });
   };
 
   // --- Enrollment Operations
   const handleEnrollParticipant = async (values: { courseId: string }) => {
     if (!selectedParticipant) return;
 
     try {
       const response = await fetch('/api/enrollments', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           participantId: selectedParticipant.id,
           courseId: values.courseId,
         }),
       });
 
       if (response.ok) {
         messageApi.success("Participant enrolled successfully!");
         setIsEnrollModalVisible(false);
         enrollForm.resetFields();
         fetchParticipants();
       } else {
         messageApi.error("Failed to enroll participant");
       }
     } catch (error) {
       messageApi.error("Failed to enroll participant");
       console.error('Error enrolling participant:', error);
     }
   };
 
   const handleUnenroll = async (enrollmentId: string) => {
     Modal.confirm({
       title: "Are you sure you want to unenroll this participant?",
       content: "All their progress in this course will be lost.",
       okText: "Yes, Unenroll",
       okType: "danger",
       cancelText: "Cancel",
       async onOk() {
         try {
           const response = await fetch(`/api/enrollments/${enrollmentId}`, {
             method: 'DELETE',
           });
 
           if (response.ok) {
             messageApi.success("Participant unenrolled successfully!");
             fetchParticipants();
           } else {
             messageApi.error("Failed to unenroll participant");
           }
         } catch (error) {
           messageApi.error("Failed to unenroll participant");
           console.error('Error unenrolling participant:', error);
         }
       },
     });
   };
 
   // Search and filter
   const filteredParticipants = participants.filter(participant =>
     participant.name.toLowerCase().includes(searchText.toLowerCase()) ||
     participant.email.toLowerCase().includes(searchText.toLowerCase()) ||
     participant.year.toString().includes(searchText)
   );
 
   // --- Column Definitions
   const columns = [
     {
       title: "Name",
       dataIndex: "name",
       render: (name: string, record: Participant) => {
         if (record.isEditing) {
           return (
             <Input
               value={record.tempName}
               onChange={(e) => 
                 setParticipants(participants.map(p => 
                   p.id === record.id 
                     ? { ...p, tempName: e.target.value }
                     : p
                 ))
               }
               placeholder="Participant name"
               prefix={<UserOutlined />}
             />
           );
         }
         return <strong>{name}</strong>;
       },
     },
     {
       title: "Email",
       dataIndex: "email",
       render: (email: string, record: Participant) => {
         if (record.isEditing) {
           return (
             <Input
               value={record.tempEmail}
               onChange={(e) => 
                 setParticipants(participants.map(p => 
                   p.id === record.id 
                     ? { ...p, tempEmail: e.target.value }
                     : p
                 ))
               }
               placeholder="Email address"
               type="email"
             />
           );
         }
         return email;
       },
     },
     {
       title: "Year",
       dataIndex: "year",
       align: "center" as const,
       render: (year: number, record: Participant) => {
         if (record.isEditing) {
           return (
             <Input
               value={record.tempYear}
               onChange={(e) => 
                 setParticipants(participants.map(p => 
                   p.id === record.id 
                     ? { ...p, tempYear: parseInt(e.target.value) || 0 }
                     : p
                 ))
               }
               placeholder="Year"
               type="number"
               style={{ width: 100 }}
             />
           );
         }
         return <Tag color="blue">{year}</Tag>;
       },
     },
     {
       title: "Enrollments",
       dataIndex: "enrollments",
       align: "center" as const,
       render: (enrollments: Enrollment[]) => (
         <Badge count={enrollments?.length || 0} showZero color="blue" />
       ),
     },
     {
       title: "Joined Date",
       dataIndex: "createdAt",
       render: (date: string) => new Date(date).toLocaleDateString(),
     },
     {
       title: "Actions",
       key: "actions",
       width: 250,
       render: (_: any, record: Participant) => {
         const isEditing = record.isEditing;
         
         return (
           <Space>
             {isEditing ? (
               <>
                 <Button 
                   type="primary" 
                   size="small" 
                   icon={<SaveOutlined />}
                   onClick={() => handleSaveParticipant(record.id)}
                 >
                   Save
                 </Button>
                 <Button 
                   size="small" 
                   icon={<CloseOutlined />}
                   onClick={() => handleCancelParticipantEdit(record.id)}
                 >
                   Cancel
                 </Button>
               </>
             ) : (
               <>
                 <Button 
                   type="link" 
                   icon={<EditOutlined />}
                   onClick={() => handleEditParticipant(record.id)}
                 >
                   Edit
                 </Button>
                 {/* <Button 
                   type="link" 
                   icon={<EyeOutlined />}
                   onClick={() => {
                     setSelectedParticipant(record);
                     // You can add a view details modal here
                   }}
                 >
                   View
                 </Button> */}
                 <Button 
                   type="link" 
                   danger 
                   icon={<DeleteOutlined />}
                   onClick={() => handleDeleteParticipant(record.id)}
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

  // Update the expandedRowRender to include progress marking
  const expandedRowRender = (participant: Participant) => {
    const enrollmentColumns = [
      {
        title: "Course",
        dataIndex: "courseName",
        render: (courseName: string) => <strong>{courseName}</strong>,
      },
      {
        title: "Progress",
        dataIndex: "progress",
        render: (progress: number, record: Enrollment) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Progress 
              percent={Math.round(progress)} 
              size="small" 
              style={{ margin: 0, flex: 1 }}
              status={progress === 100 ? "success" : "active"}
            />
            <Text type="secondary">{Math.round(progress)}%</Text>
          </div>
        ),
      },
      {
        title: "Enrolled Date",
        dataIndex: "enrolledAt",
        render: (date: string) => new Date(date).toLocaleDateString(),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: any, record: Enrollment) => (
          <Space>
            <Button 
              type="primary" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewProgress(participant, record)}
            >
              Manage Progress
            </Button>
            <Button 
              type="link" 
              danger 
              size="small"
              onClick={() => handleUnenroll(record.id)}
            >
              Unenroll
            </Button>
          </Space>
        ),
      },
    ];

    const progressColumns = [
      {
        title: "Session",
        dataIndex: "sessionTitle",
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status: string) => (
          <Tag color={status === 'completed' ? 'green' : 'blue'}>
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Last Updated",
        dataIndex: "updatedAt",
        render: (date: string) => new Date(date).toLocaleDateString(),
      },
    ];

    return (
      <div>
        {/* Enrollments Section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4>Course Enrollments</h4>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedParticipant(participant);
                setIsEnrollModalVisible(true);
              }}
            >
              Enroll in Course
            </Button>
          </div>
          <Table
            columns={enrollmentColumns}
            dataSource={participant.enrollments?.map(enroll => ({ key: enroll.id, ...enroll })) || []}
            pagination={false}
            size="small"
            bordered
            locale={{ emptyText: "Not enrolled in any courses" }}
          />
        </div>

        {/* Session Progress Section */}
        <div>
          <h4 style={{ marginBottom: 16 }}>Recent Session Progress</h4>
          <Table
            columns={progressColumns}
            dataSource={participant.sessionProgress?.slice(0, 5).map(progress => ({ key: progress.id, ...progress })) || []}
            pagination={false}
            size="small"
            bordered
            locale={{ emptyText: "No session progress recorded" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Participants Management</Title>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Input
            placeholder="Search participants by name, email, or year..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsAddParticipantModalVisible(true)}
          >
            Add Participant
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredParticipants.map(participant => ({ key: participant.id, ...participant }))}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => true,
          }}
          pagination={{ pageSize: 10 }}
          bordered
          loading={loading}
          locale={{ emptyText: "No participants found" }}
        />
      </Card>

      {/* Progress Management Modal */}
      <Modal
        title={
          <div>
            <div>Manage Progress: {selectedParticipant?.name}</div>
            <div style={{ fontSize: 14, fontWeight: 'normal', color: '#666' }}>
              Course: {selectedEnrollment?.courseName}
            </div>
          </div>
        }
        open={isProgressModalVisible}
        onCancel={() => {
          setIsProgressModalVisible(false);
          setCourseDetails(null);
        }}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsProgressModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {courseDetails && (
          <div>
            <Paragraph>{courseDetails.description}</Paragraph>
            <Divider />
            
            <Collapse defaultActiveKey={['0']}>
              {courseDetails.categories?.map((category) => (
                <Panel 
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>{category.name}</Text>
                      <Badge 
                        count={
                          category.sessions.filter(s => s.progress?.status === 'completed').length + 
                          '/' + 
                          category.sessions.length
                        } 
                        style={{ backgroundColor: '#52c41a' }} 
                      />
                    </div>
                  } 
                  key={category.id}
                >
                  <List
                    dataSource={category.sessions.sort((a, b) => a.orderIndex - b.orderIndex)}
                    renderItem={(session) => (
                      <List.Item
                        actions={[
                          <div key="status" style={{ width: 120, textAlign: 'right' }}>
                            <Checkbox
                              checked={session.progress?.status === 'completed'}
                              disabled={updatingProgress === session.id}
                              onChange={(e) => 
                                handleUpdateSessionProgress(
                                  session.id, 
                                  e.target.checked ? 'completed' : 'in_progress'
                                )
                              }
                            >
                              <Text type={session.progress?.status === 'completed' ? 'success' : 'secondary'}>
                                {session.progress?.status === 'completed' ? 'Completed' : 'Mark Complete'}
                              </Text>
                            </Checkbox>
                          </div>,
                          renderAssetLink(session)
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            session.progress?.status === 'completed' ? (
                              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                            ) : (
                              <div style={{ width: 16, height: 16, border: '2px solid #d9d9d9', borderRadius: 2 }} />
                            )
                          }
                          title={session.title}
                          description={
                            <Text type="secondary">
                              {session.assetType?.toUpperCase()} • Order: {session.orderIndex}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>

            <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Overall Course Progress</Text>
                <Text strong type="success">
                  {selectedEnrollment?.progress ? Math.round(selectedEnrollment.progress) : 0}%
                </Text>
              </div>
              <Progress 
                percent={selectedEnrollment?.progress ? Math.round(selectedEnrollment.progress) : 0} 
                status={selectedEnrollment?.progress === 100 ? "success" : "active"}
                style={{ marginTop: 8 }}
              />
            </div>
          </div>
        )}
      </Modal>

     {/* Add Participant Modal */}
      <Modal
        title="Add New Participant"
        open={isAddParticipantModalVisible}
        onCancel={() => {
          setIsAddParticipantModalVisible(false);
          newParticipantForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={newParticipantForm}
          layout="vertical"
          onFinish={handleAddParticipant}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter participant name" }]}
          >
            <Input placeholder="Enter full name" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email address" },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email address" type="email" />
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: "Please enter year" }]}
          >
            <Input 
              placeholder="Enter year" 
              type="number" 
              min={2000}
              max={2030}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Participant
              </Button>
              <Button onClick={() => setIsAddParticipantModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Enroll Participant Modal */}
      <Modal
        title={`Enroll ${selectedParticipant?.name} in Course`}
        open={isEnrollModalVisible}
        onCancel={() => {
          setIsEnrollModalVisible(false);
          enrollForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={enrollForm}
          layout="vertical"
          onFinish={handleEnrollParticipant}
        >
          <Form.Item
            name="courseId"
            label="Select Course"
            rules={[{ required: true, message: "Please select a course" }]}
          >
            <Select
              placeholder="Choose a course"
              options={courses.map(course => ({
                value: course.id,
                label: course.name,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Enroll Participant
              </Button>
              <Button onClick={() => setIsEnrollModalVisible(false)}>
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