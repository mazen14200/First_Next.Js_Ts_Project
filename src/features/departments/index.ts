export {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/features/departments/services/departments.service";

export type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@/features/departments/types/department.types";

export { default as DepartmentTable } from "@/features/departments/components/DepartmentTable";