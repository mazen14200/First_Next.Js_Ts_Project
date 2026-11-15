import { createCrudRoutes } from "@/services/crud/createCrudRoutes";

import { skillsService } from "@/features/skills/services/skills.service";
import { skillSchema } from "@/features/skills/validation/skill.schema";
import { validate } from "@/lib/validation/validate";
import { InvalidQueryError } from "@/lib/api/route-helpers";
import type { SkillFilters } from "@/features/skills/types/skills.types";

const skillsRoutes = createCrudRoutes({
  service: skillsService,
  entityName: "skill",
  validateCreate: (body) => validate(body, skillSchema),
  validateUpdate: (body) => validate(body, skillSchema),
  parseFilters: (searchParams): SkillFilters => {
    const isActiveParam = searchParams.get("IsActive");

    if (isActiveParam === null) {
      return { isActive: undefined };
    }

    if (isActiveParam === "true") {
      return { isActive: true };
    }

    if (isActiveParam === "false") {
      return { isActive: false };
    }

    throw new InvalidQueryError("IsActive");
  },
});

export const GET = skillsRoutes.collection.GET;
export const POST = skillsRoutes.collection.POST;
