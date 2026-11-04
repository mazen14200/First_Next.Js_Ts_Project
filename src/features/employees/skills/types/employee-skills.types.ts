export interface EmployeeSkill {
  id: number;
  employeeId: string;
  employeeName: string | null;
  skillId: number;
  skillNameAr: string;
  skillNameEn: string;
  skillLevelId: number;
  skillLevelNameAr: string;
  skillLevelNameEn: string;
  skillLevelRank: number;
}

export interface PaginatedEmployeeSkillsResponse {
  items: EmployeeSkill[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface GetEmployeeSkillsParams {
  employeeId: string;
  skillId?: number;
  skillLevelId?: number;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateEmployeeSkillRequest {
  skillId: number;
  skillLevelId: number;
}

export interface UpdateEmployeeSkillRequest {
  skillLevelId: number;
}

