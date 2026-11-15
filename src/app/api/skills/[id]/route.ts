import { createCrudRoutes } from "@/services/crud/createCrudRoutes";

import { skillsService } from "@/features/skills/services/skills.service";
import { skillSchema } from "@/features/skills/validation/skill.schema";
import { validate } from "@/lib/validation/validate";

const skillsRoutes = createCrudRoutes({
  service: skillsService,
  entityName: "skill",
  validateCreate: (body) => validate(body, skillSchema),
  validateUpdate: (body) => validate(body, skillSchema),
});

export const GET = skillsRoutes.item.GET;
export const PUT = skillsRoutes.item.PUT;
export const DELETE = skillsRoutes.item.DELETE;
