import serverApi from "@/services/server-api";

import type {
  CreateProjectRequest,
  NewProjectCodeResponse,
  PaginatedProjectsResponse,
  Project,
  ProjectFilters,
  UpdateProjectRequest,
} from "@/features/projects/types/project.types";

const PROJECTS_ENDPOINT = "/projects";

export async function getProjects(
  filters: ProjectFilters = {}
): Promise<PaginatedProjectsResponse> {
  const response =
    await serverApi.get<PaginatedProjectsResponse>(
      PROJECTS_ENDPOINT,
      {
        params: {
          ...(filters.managerId && {
            ManagerId: filters.managerId,
          }),

          ...(filters.statusId !== undefined && {
            StatusId: filters.statusId,
          }),

          ...(filters.startDateFrom && {
            StartDateFrom: filters.startDateFrom,
          }),

          ...(filters.startDateTo && {
            StartDateTo: filters.startDateTo,
          }),

          PageNumber: filters.pageNumber ?? 1,
          PageSize: filters.pageSize ?? 10,

          ...(filters.search?.trim() && {
            Search: filters.search.trim(),
          }),
        },
      }
    );

  return response.data;
}

export async function getProjectById(
  id: number
): Promise<Project> {
  const response = await serverApi.get<Project>(
    `${PROJECTS_ENDPOINT}/${id}`
  );

  return response.data;
}

export async function createProject(
  data: CreateProjectRequest
): Promise<Project> {
  const response =
    await serverApi.post<Project>(
      PROJECTS_ENDPOINT,
      data
    );

  return response.data;
}

export async function updateProject(
  id: number,
  data: UpdateProjectRequest
): Promise<Project> {
  const response =
    await serverApi.put<Project>(
      `${PROJECTS_ENDPOINT}/${id}`,
      data
    );

  return response.data;
}

export async function deleteProject(
  id: number
): Promise<void> {
  await serverApi.delete(
    `${PROJECTS_ENDPOINT}/${id}`
  );
}

export async function getNewProjectCode(): Promise<NewProjectCodeResponse> {
  const response =
    await serverApi.get<NewProjectCodeResponse>(
      `${PROJECTS_ENDPOINT}/new-code`
    );

  return response.data;
}