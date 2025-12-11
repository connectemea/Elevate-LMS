"use client";

import { Collapse } from "antd";
import CategoryItem from "./CategoryItem";
import SessionList from "./SessionList";
import { Category } from "@/types";
import Button from "@/components/ui/Button";

interface Props {
  category: Category;

  onAddSession: (categoryId: string) => void;
  onEditCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onEditSession: (categoryId: string, sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export default function CategorySection({ category, ...actions }: Props) {
  const items = [
    {
      key: category.id,
      label: <CategoryItem category={category} />,
      extra: (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            type="primary"
            onClick={() => actions.onAddSession(category.id)}
          >
            Add Session
          </Button>

          <Button
            style={{ marginLeft: 8 }}
            type="default"
            onClick={() => actions.onEditCategory(category.id)}
          >
            Edit
          </Button>

          <Button
            style={{ marginLeft: 8 }}
            type="danger"
            onClick={() => actions.onDeleteCategory(category.id)}
          >
            Delete
          </Button>
        </div>
      ),
      children: (
        <SessionList
          categoryId={category.id}
          sessions={category.sessions}
          onEdit={actions.onEditSession}
          onDelete={actions.onDeleteSession}
        />
      ),
    },
  ];

  return <Collapse items={items} style={{ marginBottom: 16 }} />;
}
