import { createCrudClient } from "../../../services/crud/createCrudClient";

import type {
  CreateTeamRequest,
  Team,
  UpdateTeamRequest,
} from "../types/team.types";

export const teamsClient = createCrudClient<
  Team,
  CreateTeamRequest,
  UpdateTeamRequest
>({
  basePath: "/api/teams",
});
