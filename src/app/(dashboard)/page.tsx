import { Card, Typography, Row, Col } from "antd";

export default function DashboardPage() {
  const cards = [
    { title: "Total Users", value: 1024 },
    { title: "Active Courses", value: 32 },
    { title: "Revenue", value: "$4,560" },
  ];

  return (
    <div>
      <Typography.Title level={3} style={{ marginBottom: 24 }}>
        Dashboard Overview
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {cards.map((c) => (
          <Col xs={24} sm={12} md={8} key={c.title}>
            <Card>
              <Typography.Title level={4}>{c.title}</Typography.Title>
              <Typography.Text strong>{c.value}</Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
