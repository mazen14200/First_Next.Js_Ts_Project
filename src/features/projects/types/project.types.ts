export interface Project {
  id: number;
  nameAr: string;
  nameEn: string;
  serialCode: string;
  managerId: string | null;
  managerName: string | null;
  statusId: number | null;
  statusName: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProjectListItem {
  id: number;
  nameAr: string;
  nameEn: string;
  serialCode: string;
  managerName: string | null;
  statusName: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface PaginatedProjectsResponse {
  items: ProjectListItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ProjectFilters {
  managerId?: string;
  statusId?: number;
  startDateFrom?: string;
  startDateTo?: string;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateProjectRequest {
  nameAr: string;
  nameEn: string;
  serialCode: string;
  managerId: string | null;
  statusId: number | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface UpdateProjectRequest {
  nameAr: string;
  nameEn: string;
  serialCode: string;
  managerId: string | null;
  statusId: number | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface NewProjectCodeResponse {
  code: string;
}