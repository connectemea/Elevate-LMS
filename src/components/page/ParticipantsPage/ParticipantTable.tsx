"use client";

import { Table, Space, Tag, Badge } from "antd";
import type { ColumnsType } from "antd/es/table";
import Button from "@/components/ui/Button";
import { EyeOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { Participant } from "@/types";

interface ParticipantTableProps {
  loading: boolean;
  participants: Participant[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  currentPage: number;
  pageSize: number;
  onPaginationChange: (page: number, pageSize: number) => void;
}

export default function ParticipantTable({
  loading,
  participants,
  onDelete,
  onView,
  currentPage,
  pageSize,
  onPaginationChange,
}: ParticipantTableProps) {
  const columns: ColumnsType<Participant> = [
    {
      title: "No.",
      width: 60,
      align: "center",
      render: (_, __, index) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (name) => (
        <Space>
          <UserOutlined />
          <strong>{name}</strong>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Year",
      dataIndex: "year",
      align: "center",
      render: (year) => <Tag color="blue">{year}</Tag>,
    },
    {
      title: "Enrollments",
      dataIndex: "enrollments",
      align: "center",
      render: (list) => (
        <Badge count={list?.length || 0} showZero color="blue" />
      ),
    },
    {
      title: "Active Courses",
      align: "center",
      render: (_, record) => {
        const active = record.enrollments.filter(e => e.progress < 100).length;
        return <Tag color={active ? "green" : "default"}>{active} active</Tag>;
      },
    },
    {
      title: "Joined Date",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => onView(record.id)}>
            View
          </Button>

          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<Participant>
      columns={columns}
      loading={loading}
      dataSource={participants.map((p) => ({ key: p.id, ...p }))}
      pagination={{
        current: currentPage,
        pageSize,
        showSizeChanger: true,
        onChange: onPaginationChange,
      }}
      bordered
    />
  );
}
