import { createCrudService } from "@/services/crud/createCrudService";

import type {
  CreateTeamRequest,
  Team,
  UpdateTeamRequest,
} from "@/features/teams/types/team.types";

export const teamsService = createCrudService<
  Team,
  CreateTeamRequest,
  UpdateTeamRequest
>({
  endpoint: "/teams",
});
