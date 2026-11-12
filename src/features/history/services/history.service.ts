import serverApi from "@/services/server-api";

import type {
  HistoryFilters,
  PaginatedHistoryResponse,
} from "@/features/history/types/history.types";

const HISTORY_ENDPOINT = "/History";

export async function getHistory(
  filters: HistoryFilters = {}
): Promise<PaginatedHistoryResponse> {
  const response =
    await serverApi.get<PaginatedHistoryResponse>(
      HISTORY_ENDPOINT,
      {
        params: {
          ...(filters.operationKeyId !== undefined && {
            OperationKeyId: filters.operationKeyId,
          }),

          ...(filters.userId && {
            UserId: filters.userId,
          }),

          ...(filters.fromDate && {
            FromDate: filters.fromDate,
          }),

          ...(filters.toDate && {
            ToDate: filters.toDate,
          }),

          PageNumber: filters.pageNumber ?? 1,
          PageSize: filters.pageSize ?? 10,

          ...(filters.search?.trim() && {
            Search: filters.search.trim(),
          }),
        },
      }
    );

  return response.data;
}