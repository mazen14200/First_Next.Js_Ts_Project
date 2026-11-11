import { createCrudRoutes } from "../../../services/crud/createCrudRoutes";

import { skillsService } from "../../../features/skills/services/skills.service";
import type { SkillFilters } from "../../../features/skills/types/skills.types";

const skillsRoutes = createCrudRoutes({
  service: skillsService,
  entityName: "skill",
  parseFilters: (searchParams): SkillFilters => {
    const isActiveParam = searchParams.get("IsActive");

    return {
      isActive:
        isActiveParam === null
          ? undefined
          : isActiveParam === "true",
    };
  },
});

export const GET = skillsRoutes.collection.GET;
export const POST = skillsRoutes.collection.POST;
