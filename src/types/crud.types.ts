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
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}
