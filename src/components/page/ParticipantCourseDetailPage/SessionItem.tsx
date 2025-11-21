"use client";

import { List, Checkbox, Typography } from "antd";
import Button from "@/components/ui/Button";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Session } from "@/types/session";

const { Text } = Typography;

export default function SessionItem({ session, onUpdateSession } : { session: Session ; onUpdateSession: (sessionId: string, status: "completed" | "in_progress") => void }) {
  const done = session.progress?.status === "completed";

  const assetLink = () => {
    if (!session.assetLink) return null;

    return (
      <Button type="link" href={session.assetLink} target="_blank">
        {session.assetType.toUpperCase()}
      </Button>
    );
  };

  return (
    <List.Item
      actions={[
        <Checkbox
          checked={done}
          onChange={(e) =>
            onUpdateSession(session.id, e.target.checked ? "completed" : "in_progress")
          }
        >
          {done ? "Completed" : "Mark Complete"}
        </Checkbox>,
        assetLink(),
      ]}
    >
      <List.Item.Meta
        avatar={
          done ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : null
        }
        title={session.title}
        description={`${session.assetType.toUpperCase()} • Order: ${session.orderIndex}`}
      />
    </List.Item>
  );
}
