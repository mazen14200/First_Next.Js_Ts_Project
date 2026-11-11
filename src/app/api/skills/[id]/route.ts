import { createCrudRoutes } from "../../../../services/crud/createCrudRoutes";

import { skillsService } from "../../../../features/skills/services/skills.service";

const skillsRoutes = createCrudRoutes({
  service: skillsService,
  entityName: "skill",
});

export const GET = skillsRoutes.item.GET;
export const PUT = skillsRoutes.item.PUT;
export const DELETE = skillsRoutes.item.DELETE;
