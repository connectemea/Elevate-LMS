import { Session } from "./session";

export interface Category {
  id: string;
  name: string;
  orderIndex: number;
  sessions: Session[];

  // UI-only fields
  isEditing?: boolean;
  tempName?: string;
  tempOrderIndex?: number;
}
