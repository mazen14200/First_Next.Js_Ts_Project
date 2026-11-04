export interface Team {
  id: number;
  nameAR: string;
  nameEN: string;
  rate: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaginatedTeamsResponse {
  items: Team[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface GetTeamsParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateTeamRequest {
  nameAR: string;
  nameEN: string;
  rate: number;
}

export interface UpdateTeamRequest {
  nameAR: string;
  nameEN: string;
  rate: number;
}
