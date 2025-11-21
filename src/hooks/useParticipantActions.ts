import { message } from "antd";
import { participantService } from "@/services/participant.service";
import { useState } from "react";

type ParticipantLite = {
  id: string;
  name: string;
  email: string;
  year: number;
};

export function useParticipantActions(refetch: () => void) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isEnrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantLite | null>(null);

  const openEditModal = (participant: ParticipantLite) => {
    setSelectedParticipant(participant);
    setEditModalOpen(true);
  };

  const openEnrollModal = (participant?: ParticipantLite) => {
    if (participant) setSelectedParticipant(participant);
    setEnrollModalOpen(true);
  };

  const closeEditModal = () => setEditModalOpen(false);
  const closeEnrollModal = () => setEnrollModalOpen(false);

  const handleUpdateParticipant = async (values: any) => {
    if (!selectedParticipant) return message.error("No participant selected");

    await participantService.update(selectedParticipant.id, values);
    message.success("Participant updated");
    closeEditModal();
    refetch();
  };

  const handleEnrollCourse = async (values: any) => {
    if (!selectedParticipant) return message.error("No participant selected");

    await participantService.enroll({
      participantId: selectedParticipant.id,
      courseId: values.courseId,
    });

    message.success("Enrolled successfully");
    closeEnrollModal();
    refetch();
  };

  const handleUnenroll = async (enrollmentId: string) => {
    await participantService.unenroll(enrollmentId);
    message.success("Unenrolled successfully");
    refetch();
  };

  return {
    isEditModalOpen,
    isEnrollModalOpen,
    openEditModal,
    openEnrollModal,
    closeEditModal,
    closeEnrollModal,
    handleUpdateParticipant,
    handleEnrollCourse,
    handleUnenroll,
  };
}
