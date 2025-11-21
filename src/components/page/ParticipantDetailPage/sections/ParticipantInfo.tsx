import { Card, Typography, Tag, Row, Col } from "antd";
const { Text, Paragraph } = Typography;

export default function ParticipantInfo({ participant }: any) {
  return (
    <Card title="Participant Info">
      <Row gutter={16}>
        <Col span={8}><Paragraph><Text strong>Name:</Text> {participant.name}</Paragraph></Col>
        <Col span={8}><Paragraph><Text strong>Email:</Text> {participant.email}</Paragraph></Col>
        <Col span={8}><Paragraph><Text strong>Year:</Text> <Tag color="blue">{participant.year}</Tag></Paragraph></Col>
      </Row>
      <Paragraph><Text strong>Joined:</Text> {new Date(participant.createdAt).toLocaleDateString()}</Paragraph>
    </Card>
  );
}
