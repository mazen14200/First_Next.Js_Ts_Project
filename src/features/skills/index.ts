export {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  activateSkill,
  deactivateSkill,
} from "./services/skills.service";

export type {
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
} from "./types/skills.types";