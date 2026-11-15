import { createCrudRoutes } from "@/services/crud/createCrudRoutes";

import { teamsService } from "@/features/teams/services/teams.service";
import { teamSchema } from "@/features/teams/validation/team.schema";
import { validate } from "@/lib/validation/validate";

export const teamsRoutes = createCrudRoutes({
  service: teamsService,
  entityName: "team",
  validateCreate: (body) => validate(body, teamSchema),
  validateUpdate: (body) => validate(body, teamSchema),
});

export const GET = teamsRoutes.collection.GET;
export const POST = teamsRoutes.collection.POST;
