"use client";

import { Modal, Input, List, Checkbox, Space, Typography } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { User } from "@/types";

const { Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;

  filteredUsers: User[];
  usersLoading: boolean;
  searchText: string;
  selectedUserIds: string[];
  enrolling: boolean;

  onSearch: (q: string) => void;
  onToggleSelect: (userId: string) => void;
  onEnroll: () => void;
}

export default function AddEnrollmentModal({
  open,
  onClose,
  filteredUsers,
  usersLoading,
  searchText,
  selectedUserIds,
  enrolling,
  onSearch,
  onToggleSelect,
  onEnroll,
}: Props) {
  return (
    <Modal
      title="Enroll Participants"
      open={open}
      onCancel={onClose}
      footer={[
        <button key="cancel" className="ant-btn" onClick={onClose}>
          Cancel
        </button>,
        <button
          key="submit"
          className="ant-btn ant-btn-primary"
          onClick={onEnroll}
          disabled={selectedUserIds.length === 0}
        >
          Enroll Selected ({selectedUserIds.length})
        </button>,
      ]}
      width={600}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <Input
          placeholder="Search by name or email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />

        <div style={{ maxHeight: 400, overflow: "auto" }}>
          <List
            loading={usersLoading}
            dataSource={filteredUsers}
            locale={{
              emptyText:
                usersLoading
                  ? "Loading..."
                  : searchText
                  ? "No match found"
                  : "No participants available",
            }}
            renderItem={(user) => (
              <List.Item
                actions={[
                  <Checkbox
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => onToggleSelect(user.id)}
                  >
                    Select
                  </Checkbox>,
                ]}
              >
                <List.Item.Meta
                  avatar={<UserOutlined />}
                  title={user.name || "Unnamed"}
                  description={user.email}
                />
              </List.Item>
            )}
          />
        </div>

        {selectedUserIds.length > 0 && (
          <Text type="secondary">{selectedUserIds.length} selected</Text>
        )}
      </Space>
    </Modal>
  );
}
