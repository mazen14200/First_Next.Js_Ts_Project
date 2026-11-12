import serverApi from "@/services/server-api";

import type {
  SkillLevel,
  CreateSkillLevelRequest,
  UpdateSkillLevelRequest,
} from "@/features/skill-levels/types/skill-levels.types";

const SKILL_LEVELS_ENDPOINT = "/skill-levels";

export async function getSkillLevels(): Promise<
  SkillLevel[]
> {
  const response = await serverApi.get<SkillLevel[]>(
    SKILL_LEVELS_ENDPOINT
  );

  return response.data;
}

export async function getSkillLevelById(
  id: number
): Promise<SkillLevel> {
  const response = await serverApi.get<SkillLevel>(
    `${SKILL_LEVELS_ENDPOINT}/${id}`
  );

  return response.data;
}

export async function createSkillLevel(
  data: CreateSkillLevelRequest
): Promise<SkillLevel> {
  const response = await serverApi.post<SkillLevel>(
    SKILL_LEVELS_ENDPOINT,
    data
  );

  return response.data;
}

export async function updateSkillLevel(
  id: number,
  data: UpdateSkillLevelRequest
): Promise<SkillLevel> {
  const response = await serverApi.put<SkillLevel>(
    `${SKILL_LEVELS_ENDPOINT}/${id}`,
    data
  );

  return response.data;
}

export async function deleteSkillLevel(
  id: number
): Promise<void> {
  await serverApi.delete(
    `${SKILL_LEVELS_ENDPOINT}/${id}`
  );
}