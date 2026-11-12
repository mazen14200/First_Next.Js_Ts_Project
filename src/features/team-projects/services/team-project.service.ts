import api from "@/services/server-api";

import type {
  CreateTeamProjectRequest,
  GetTeamProjectsParams,
  PaginatedTeamProjectsResponse,
  TeamProject,
  UpdateTeamProjectRequest,
} from "@/features/team-projects/types/team-project.types";

export const getTeamProjects = async ({
  teamId,
  projectId,
  pageNumber = 1,
  pageSize = 10,
  search = "",
}: GetTeamProjectsParams = {}): Promise<PaginatedTeamProjectsResponse> => {
  const response =
    await api.get<PaginatedTeamProjectsResponse>(
      "/team-projects",
      {
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,

          ...(teamId !== undefined && {
            TeamId: teamId,
          }),

          ...(projectId !== undefined && {
            ProjectId: projectId,
          }),

          ...(search.trim() && {
            Search: search.trim(),
          }),
        },
      }
    );

  return response.data;
};

export const getTeamProjectById = async (
  id: number
): Promise<TeamProject> => {
  const response = await api.get<TeamProject>(
    `/team-projects/${id}`
  );

  return response.data;
};

export const createTeamProject = async (
  data: CreateTeamProjectRequest
): Promise<TeamProject> => {
  const response = await api.post<TeamProject>(
    "/team-projects",
    data
  );

  return response.data;
};

export const updateTeamProject = async (
  id: number,
  data: UpdateTeamProjectRequest
): Promise<TeamProject> => {
  const response = await api.put<TeamProject>(
    `/team-projects/${id}`,
    data
  );

  return response.data;
};

export const deleteTeamProject = async (
  id: number
): Promise<void> => {
  await api.delete(`/team-projects/${id}`);
};