export type AssetType = "youtube" | "web" | "pdf" | "other";

export interface Session {
  id: string;
  title: string;
  assetLink: string;
  assetType: AssetType;
  orderIndex: number;
  createdAt: string;
  progress?: {
    status:  "in_progress" | "completed";
    updatedAt: string;
  };

  // UI-only temporary edit fields
  isEditing?: boolean;
  tempTitle?: string;
  tempAssetLink?: string;
  tempAssetType?: AssetType;
  tempOrderIndex?: number;
}
