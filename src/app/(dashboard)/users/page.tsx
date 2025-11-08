"use client";

import { useState } from "react";
import { Title, Table, Button, Space, Input, Card } from "@/components/antd";

interface User {
  key: string;
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { key: "1", name: "Muhammed Shamil", email: "shamil@example.com" },
    { key: "2", name: "Sreekanth", email: "sreekanth@example.com" },
  ]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editData, setEditData] = useState<User | null>(null);
  const [searchText, setSearchText] = useState("");

  const handleEdit = (record: User) => {
    setEditingKey(record.key);
    setEditData({ ...record });
  };

  const handleSave = () => {
    if (!editData) return;
    const updated = users.map((u) => (u.key === editData.key ? editData : u));
    setUsers(updated);
    setEditingKey(null);
    setEditData(null);
  };

  const handleDelete = (key: string) => {
    setUsers(users.filter((u) => u.key !== key));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_: any, record: User) =>
        editingKey === record.key ? (
          <Input
            value={editData?.name}
            onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
          />
        ) : (
          record.name
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_: any, record: User) =>
        editingKey === record.key ? (
          <Input
            value={editData?.email}
            onChange={(e) =>
              setEditData({ ...editData!, email: e.target.value })
            }
          />
        ) : (
          record.email
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => {
        const editable = editingKey === record.key;
        return (
          <Space>
            {editable ? (
              <>
                <Button size="small" type="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button size="small" onClick={() => setEditingKey(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="link" onClick={() => handleEdit(record)}>
                  Edit
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(record.key)}
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

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Users</Title>

      <Card style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Input
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 240 }}
          />
          <Button type="primary" onClick={() => alert("TODO: Add User modal")}>
            + Add User
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>
    </div>
  );
}
