export {
  getEmployeeSkills,
  createEmployeeSkill,
  updateEmployeeSkill,
  deleteEmployeeSkill,
} from "@/features/employees/skills/services/employee-skill.service";

export type {
  EmployeeSkill,
  PaginatedEmployeeSkillsResponse,
  GetEmployeeSkillsParams,
  CreateEmployeeSkillRequest,
  UpdateEmployeeSkillRequest,
} from "@/features/employees/skills/types/employee-skills.types";