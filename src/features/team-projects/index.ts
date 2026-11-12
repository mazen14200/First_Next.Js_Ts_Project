export {
  createTeamProject,
  deleteTeamProject,
  getTeamProjectById,
  getTeamProjects,
  updateTeamProject,
} from "@/features/team-projects/services/team-project.service";

export type {
  TeamProject,
  PaginatedTeamProjectsResponse,
  GetTeamProjectsParams,
  CreateTeamProjectRequest,
  UpdateTeamProjectRequest,
  TeamProjectOption
} from "@/features/team-projects/types/team-project.types"