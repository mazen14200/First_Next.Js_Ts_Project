import { createCrudRoutes } from "@/services/crud/createCrudRoutes";

import { teamsService } from "@/features/teams/services/teams.service";

const teamsRoutes = createCrudRoutes({
  service: teamsService,
  entityName: "team",
});

export const GET = teamsRoutes.item.GET;
export const PUT = teamsRoutes.item.PUT;
export const DELETE = teamsRoutes.item.DELETE;
