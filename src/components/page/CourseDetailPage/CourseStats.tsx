"use client";

import { Card, Col, Row, Statistic } from "antd";
import { UserOutlined } from "@ant-design/icons";

type Props = {
  totalEnrollments: number;
  categoryCount: number;
  totalSessions: number;
  completionRate: number;
};

export default function CourseStats({
  totalEnrollments,
  categoryCount,
  totalSessions,
  completionRate,
}: Props) {
  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Enrollments"
            value={totalEnrollments}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Categories" value={categoryCount} />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Total Sessions" value={totalSessions} />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Completion Rate" value={completionRate} suffix="%" />
        </Card>
      </Col>
    </Row>
  );
}
