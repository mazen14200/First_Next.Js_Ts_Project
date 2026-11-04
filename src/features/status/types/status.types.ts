export interface Status {
  id: number;
  name: string;
  description: string | null;
  colorCode: string | null;
  displayOrder: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateStatusRequest {
  name: string;
  description: string | null;
  colorCode: string | null;
  displayOrder: number | null;
}

export interface UpdateStatusRequest {
  name: string;
  description: string | null;
  colorCode: string | null;
  displayOrder: number | null;
  isActive: boolean | null;
}