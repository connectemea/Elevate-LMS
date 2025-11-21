import { List } from "antd";
import SessionItem from "./SessionItem";
import { Session } from "@/types";

interface Props {
  categoryId: string;
  sessions: Session[];
  onEdit: (categoryId: string, sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}

export default function SessionList({
  sessions,
  categoryId,
  onEdit,
  onDelete,
}: Props) {
  return (
    <List
      dataSource={sessions}
      locale={{ emptyText: "No sessions in this category" }}
      renderItem={(s) => (
        <SessionItem
          session={s}
          categoryId={categoryId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
}
