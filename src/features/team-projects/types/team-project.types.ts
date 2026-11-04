export interface TeamProject {
  id: number;

  teamId: number;
  teamNameAr: string | null;
  teamNameEn: string | null;

  rate: number | null;

  projectId: number;
  projectNameAr: string | null;
  projectNameEn: string | null;

  descriptionAR: string | null;
  descriptionEN: string | null;
}

export interface PaginatedTeamProjectsResponse {
  items: TeamProject[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface GetTeamProjectsParams {
  teamId?: number;
  projectId?: number;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateTeamProjectRequest {
  teamId: number;
  projectId: number;
  descriptionAR: string | null;
  descriptionEN: string | null;
}

export interface UpdateTeamProjectRequest {
  descriptionAR: string | null;
  descriptionEN: string | null;
}

export interface TeamProjectOption {
  id: number;
  nameAR: string;
  nameEN: string;
}