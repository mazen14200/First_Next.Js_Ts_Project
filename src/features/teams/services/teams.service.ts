import api from "../../../services/server-api";

import type {
  CreateTeamRequest,
  GetTeamsParams,
  PaginatedTeamsResponse,
  Team,
  UpdateTeamRequest,
} from "../types/team.types";

export const getTeams = async ({
  pageNumber = 1,
  pageSize = 10,
  search = "",
}: GetTeamsParams = {}): Promise<PaginatedTeamsResponse> => {
  const response = await api.get<PaginatedTeamsResponse>("/teams", {
    params: {
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...(search.trim() && {
        Search: search.trim(),
      }),
    },
  });

  return response.data;
};

export const getTeamById = async (id: number): Promise<Team> => {
  const response = await api.get<Team>(`/teams/${id}`);

  return response.data;
};

export const createTeam = async (
  data: CreateTeamRequest
): Promise<Team> => {
  const response = await api.post<Team>("/teams", data);

  return response.data;
};

export const updateTeam = async (
  id: number,
  data: UpdateTeamRequest
): Promise<Team> => {
  const response = await api.put<Team>(`/teams/${id}`, data);

  return response.data;
};

export const deleteTeam = async (id: number): Promise<void> => {
  await api.delete(`/teams/${id}`);
};
