"use client";

import { useState } from "react";
import { Card, Input, Modal } from "antd";
import { Title } from "@/components/antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import Button from "@/components/ui/Button";

import { useParticipants } from "@/hooks/useParticipants";
import ParticipantTable from "./ParticipantTable";
import AddParticipantModal from "./AddParticipantModal";
import { useRouter } from "next/navigation";

import {
  Participant,
  NewParticipantPayload,
} from "@/types";

export default function ParticipantsPage() {
  const router = useRouter();

  const {
    data,
    isLoading,
    addParticipant,
    deleteParticipant,
    addLoading,
  } = useParticipants();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [modal, modalHolder] = Modal.useModal();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const filtered: Participant[] = (data ?? []).filter(
    (p: Participant) => {
      const text = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(text) ||
        p.email.toLowerCase().includes(text) ||
        p.year.toString().includes(search)
      );
    }
  );

  return (
    <div style={{ padding: 24 }}>
      {modalHolder}
      <Title level={2}>Participants</Title>

      <Card style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Input
            placeholder="Search..."
            prefix={<UserOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 400 }}
            allowClear
          />

          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddOpen(true)}>
            Add Participant
          </Button>
        </div>

        <ParticipantTable
          loading={isLoading}
          participants={filtered}
          currentPage={currentPage}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onDelete={(id: string) =>
            modal.confirm({
              title: "Delete participant?",
              okType: "danger",
              onOk: () => deleteParticipant(id),
            })
          }
          onView={(id: string) => router.push(`/participants/${id}`)}
        />

        <div style={{ textAlign: "right", marginTop: 10 }}>
          Total: {filtered.length}
        </div>
      </Card>

      <AddParticipantModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreate={(payload: NewParticipantPayload) => {
          addParticipant(payload);
          setIsAddOpen(false);
        }}
        loading={addLoading}
      />
    </div>
  );
}
