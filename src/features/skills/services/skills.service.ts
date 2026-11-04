import serverApi from "../../../services/server-api";

import type {
  Skill,
  PaginatedSkillsResponse,
  CreateSkillRequest,
  UpdateSkillRequest,
} from "../types/skills.types";

const SKILLS_ENDPOINT = "/skills";

export async function getSkills(
  pageNumber: number = 1,
  pageSize: number = 10,
  search: string = "",
  isActive?: boolean
): Promise<PaginatedSkillsResponse> {
  const response = await serverApi.get<PaginatedSkillsResponse>(
    SKILLS_ENDPOINT,
    {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        ...(search.trim() && {
          Search: search.trim(),
        }),
        ...(isActive !== undefined && {
          IsActive: isActive,
        }),
      },
    }
  );

  return response.data;
}

export async function getSkillById(
  id: number
): Promise<Skill> {
  const response = await serverApi.get<Skill>(
    `${SKILLS_ENDPOINT}/${id}`
  );

  return response.data;
}

export async function createSkill(
  data: CreateSkillRequest
): Promise<Skill> {
  const response = await serverApi.post<Skill>(
    SKILLS_ENDPOINT,
    data
  );

  return response.data;
}

export async function updateSkill(
  id: number,
  data: UpdateSkillRequest
): Promise<Skill> {
  const response = await serverApi.put<Skill>(
    `${SKILLS_ENDPOINT}/${id}`,
    data
  );

  return response.data;
}

export async function deleteSkill(
  id: number
): Promise<void> {
  await serverApi.delete(`${SKILLS_ENDPOINT}/${id}`);
}

export async function activateSkill(
  id: number
): Promise<void> {
  await serverApi.patch(
    `${SKILLS_ENDPOINT}/${id}/activate`
  );
}

export async function deactivateSkill(
  id: number
): Promise<void> {
  await serverApi.patch(
    `${SKILLS_ENDPOINT}/${id}/deactivate`
  );
}