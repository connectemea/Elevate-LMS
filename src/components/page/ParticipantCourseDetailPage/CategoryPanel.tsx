"use client";

import { Collapse, Progress, Badge, List, Typography } from "antd";
import SessionItem from "./SessionItem";
import { Category, Session } from "@/types";

const { Text } = Typography;

export default function CategoryPanel({
  category,
  onUpdateSession,
}: {
  category: Category;
  onUpdateSession: (
    sessionId: string,
    status: "completed" | "in_progress"
  ) => void;
}) {
  const completed = category.sessions.filter(
    (s: Session) => s.progress?.status === "completed"
  ).length;

  const total = category.sessions.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const items = [
    {
      key: category.id,
      label: (
        <div className="flex-between">
          <Text strong>{category.name}</Text>
          <div className="flex gap">
            <Progress percent={percent} size="small" />
            <Badge count={`${completed}/${total}`} />
          </div>
        </div>
      ),
      children: (
        <List
          dataSource={category.sessions}
          renderItem={(session) => (
            <SessionItem
              key={session.id}
              session={session}
              onUpdateSession={onUpdateSession}
            />
          )}
        />
      ),
    },
  ];

  return <Collapse items={items} />;
}
