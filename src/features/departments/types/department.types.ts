export interface Department {
  id: number;
  nameAR: string;
  nameEN: string;
}

export interface PaginatedDepartmentsResponse {
  items: Department[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateDepartmentRequest {
  nameAR: string;
  nameEN: string;
}

export interface UpdateDepartmentRequest {
  nameAR: string;
  nameEN: string;
}