import serverApi from "@/services/server-api";
import {
  createCrudService,
  defaultToQuery,
} from "@/services/crud/createCrudService";

import type {
  CreateSkillRequest,
  Skill,
  SkillFilters,
  UpdateSkillRequest,
} from "@/features/skills/types/skills.types";

const base = createCrudService<
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
  SkillFilters
>({
  endpoint: "/skills",
  toQuery: (params) => ({
    ...defaultToQuery(params),
    ...(params.isActive !== undefined && {
      IsActive: params.isActive,
    }),
  }),
});

export const skillsService = {
  ...base,

  activate: async (id: number): Promise<void> => {
    await serverApi.patch(`/skills/${id}/activate`);
  },

  deactivate: async (id: number): Promise<void> => {
    await serverApi.patch(`/skills/${id}/deactivate`);
  },
};
