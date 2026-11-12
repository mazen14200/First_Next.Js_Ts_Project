import { createCrudRoutes } from "@/services/crud/createCrudRoutes";

import { teamsService } from "@/features/teams/services/teams.service";

export const teamsRoutes = createCrudRoutes({
  service: teamsService,
  entityName: "team",
});

export const GET = teamsRoutes.collection.GET;
export const POST = teamsRoutes.collection.POST;
