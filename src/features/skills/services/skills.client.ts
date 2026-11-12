import {
  createCrudClient,
  defaultToSearchParams,
  parseError,
} from "@/services/crud/createCrudClient";

import type {
  CreateSkillRequest,
  Skill,
  SkillFilters,
  UpdateSkillRequest,
} from "@/features/skills/types/skills.types";

import { apiFetch } from "@/lib/api/client-fetch";

const base = createCrudClient<
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
  SkillFilters
>({
  basePath: "/api/skills",
  toSearchParams: (params) => {
    const searchParams = defaultToSearchParams(params);

    if (params.isActive !== undefined) {
      searchParams.set("IsActive", String(params.isActive));
    }

    return searchParams;
  },
});

export const skillsClient = {
  ...base,

  setActive: async (
    id: number,
    isActive: boolean
  ): Promise<void> => {
    const action = isActive ? "activate" : "deactivate";

    const response = await apiFetch(`/api/skills/${id}/${action}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw await parseError(response);
    }
  },
};
