export interface HistoryItem {
  id: number;
  operation: string;
  operationKeyId: number;
  operationKeyName: string;
  actionDate: string;
  userName: string;
  fullName: string;
  userId: string | null;
  controllerName: string | null;
  actionName: string | null;
  ipAddress: string | null;
  requestPath: string | null;
  statusCode: number;
  affectedEntityId: number | null;
}

export interface PaginatedHistoryResponse {
  items: HistoryItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface HistoryFilters {
  operationKeyId?: number;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}