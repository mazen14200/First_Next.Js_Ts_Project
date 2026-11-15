export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface ApiErrorBody {
  code?: string;
  message?: string;
  detail?: string;
  fieldErrors?: Record<string, string[]>;
  errors?: Record<string, string[]>;
}
