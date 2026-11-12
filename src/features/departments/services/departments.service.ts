import api from "@/services/server-api";

import type {
  Department,
  PaginatedDepartmentsResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@/features/departments/types/department.types";

export const getDepartments = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  search: string = ""
): Promise<PaginatedDepartmentsResponse> => {
  const response = await api.get<PaginatedDepartmentsResponse>(
    "/Department",
    {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
        ...(search.trim() && {
          Search: search.trim(),
        }),
      },
    }
  );

  return response.data;
};

export const getDepartmentById = async (
  id: number
): Promise<Department> => {
  const response = await api.get<Department>(
    `/Department/${id}`
  );

  return response.data;
};

export const createDepartment = async (
  data: CreateDepartmentRequest
): Promise<Department> => {
  const response = await api.post<Department>(
    "/Department",
    data
  );

  return response.data;
};

export const updateDepartment = async (
  id: number,
  data: UpdateDepartmentRequest
): Promise<void> => {
  await api.put(`/Department/${id}`, data);
};

export const deleteDepartment = async (
  id: number
): Promise<void> => {
  await api.delete(`/Department/${id}`);
};