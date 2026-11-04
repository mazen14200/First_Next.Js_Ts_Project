export {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "./services/departments.service";

export type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "./types/department.types";

export { default as DepartmentTable } from "./components/DepartmentTable";