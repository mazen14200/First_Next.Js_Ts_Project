export {
  createTeamProject,
  deleteTeamProject,
  getTeamProjectById,
  getTeamProjects,
  updateTeamProject,
} from "./services/team-project.service";

export type {
  TeamProject,
  PaginatedTeamProjectsResponse,
  GetTeamProjectsParams,
  CreateTeamProjectRequest,
  UpdateTeamProjectRequest,
  TeamProjectOption
} from "./types/team-project.types"