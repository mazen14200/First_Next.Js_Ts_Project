export interface Role {
  id: number;
  nameAr: string;
  nameEn: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateRoleRequest {
  nameAr: string;
  nameEn: string;
  description: string | null;
}

export interface UpdateRoleRequest {
  nameAr: string;
  nameEn: string;
  description: string | null;
}
