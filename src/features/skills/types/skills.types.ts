export interface Skill {
  id: number;
  nameAr: string;
  nameEn: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaginatedSkillsResponse {
  items: Skill[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateSkillRequest {
  nameAr: string;
  nameEn: string;
  description: string | null;
}

export interface UpdateSkillRequest {
  nameAr: string;
  nameEn: string;
  description: string | null;
}