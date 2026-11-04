import serverApi from "../../../../services/server-api";

import type {
  EmployeeSkill,
  PaginatedEmployeeSkillsResponse,
  GetEmployeeSkillsParams,
  CreateEmployeeSkillRequest,
  UpdateEmployeeSkillRequest,
} from "../types/employee-skills.types";

const EMPLOYEE_SKILLS_ENDPOINT = "/employees";

export async function getEmployeeSkills({
  employeeId,
  skillId,
  skillLevelId,
  pageNumber = 1,
  pageSize = 10,
  search = "",
}: GetEmployeeSkillsParams): Promise<PaginatedEmployeeSkillsResponse> {
  const response =
    await serverApi.get<PaginatedEmployeeSkillsResponse>(
      `${EMPLOYEE_SKILLS_ENDPOINT}/${employeeId}/skills`,
      {
        params: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          ...(skillId !== undefined && {
            SkillId: skillId,
          }),
          ...(skillLevelId !== undefined && {
            SkillLevelId: skillLevelId,
          }),
          ...(search.trim() && {
            Search: search.trim(),
          }),
        },
      }
    );

  return response.data;
}

export async function createEmployeeSkill(
  employeeId: string,
  data: CreateEmployeeSkillRequest
): Promise<EmployeeSkill> {
  const response = await serverApi.post<EmployeeSkill>(
    `${EMPLOYEE_SKILLS_ENDPOINT}/${employeeId}/skills`,
    data
  );

  return response.data;
}

export async function updateEmployeeSkill(
  employeeId: string,
  skillId: number,
  data: UpdateEmployeeSkillRequest
): Promise<EmployeeSkill> {
  const response = await serverApi.put<EmployeeSkill>(
    `${EMPLOYEE_SKILLS_ENDPOINT}/${employeeId}/skills/${skillId}`,
    data
  );

  return response.data;
}

export async function deleteEmployeeSkill(
  employeeId: string,
  skillId: number
): Promise<void> {
  await serverApi.delete(
    `${EMPLOYEE_SKILLS_ENDPOINT}/${employeeId}/skills/${skillId}`
  );
}

