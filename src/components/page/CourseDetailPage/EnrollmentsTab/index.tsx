"use client";

import { Card, Button, Tabs } from "antd";
import EnrollmentTable from "./EnrollmentTable";
import AddEnrollmentModal from "./AddEnrollmentModal";
import { Enrollment, User } from "@/types";
import { UserAddOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

interface Props {
  enrollments: Enrollment[];

  open: boolean;          // add
  onClose: () => void;    // add

  availableUsers: User[];
  filteredUsers: User[];
  usersLoading: boolean;
  searchText: string;
  selectedUserIds: string[];
  enrolling: boolean;

  onOpenModal: () => void;
  onSearch: (q: string) => void;
  onToggleSelect: (userId: string) => void;
  onEnroll: () => void;
}


export default function EnrollmentsTab({
  enrollments,
  open,
  onClose,
  onOpenModal,
  ...props
}: Props) {
  return (
    <Card
      title="Enrollments"
      extra={
        <Button type="primary" icon={<UserAddOutlined />} onClick={onOpenModal}>
          Add Users
        </Button>
      }
    >
      <EnrollmentTable enrollments={enrollments} />

      <AddEnrollmentModal
        open={open}
        onClose={onClose}
        {...props}
      />
    </Card>
  );
}
