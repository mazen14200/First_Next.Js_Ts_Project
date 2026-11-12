import { ApiError } from "@/lib/api/api-error";

import type {
  ApiErrorBody,
  ListParams,
  PagedResult,
} from "@/types/crud.types";

import { apiFetch } from "@/lib/api/client-fetch";

export function defaultToSearchParams(
  params: ListParams
): URLSearchParams {
  const searchParams = new URLSearchParams();

  searchParams.set(
    "PageNumber",
    String(params.pageNumber ?? 1)
  );
  searchParams.set(
    "PageSize",
    String(params.pageSize ?? 10)
  );

  const search = params.search?.trim() ?? "";

  if (search) {
    searchParams.set("Search", search);
  }

  return searchParams;
}

export interface CrudClient<
  TEntity,
  TCreate,
  TUpdate,
  TFilters,
  TId,
> {
  getAll: (
    params?: ListParams & TFilters
  ) => Promise<PagedResult<TEntity>>;
  getById: (id: TId) => Promise<TEntity>;
  create: (dto: TCreate) => Promise<TEntity>;
  update: (id: TId, dto: TUpdate) => Promise<TEntity>;
  remove: (id: TId) => Promise<void>;
}

interface CreateCrudClientOptions<TFilters extends object> {
  basePath: string;
  toSearchParams?: (
    params: ListParams & TFilters
  ) => URLSearchParams;
}

export async function parseError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody | null = null;
  let message = `Request failed with status ${response.status}`;

  try {
    const data: unknown = await response.json();

    if (data && typeof data === "object") {
      body = data as ApiErrorBody;
      message =
        body.message ??
        body.detail ??
        message;
    } else if (typeof data === "string" && data) {
      message = data;
    }
  } catch {
    // Response has no JSON body
  }

  return new ApiError(response.status, message, body);
}

export function createCrudClient<
  TEntity,
  TCreate,
  TUpdate = TCreate,
  TFilters extends object = Record<string, never>,
  TId extends number | string = number,
>({
  basePath,
  toSearchParams,
}: CreateCrudClientOptions<TFilters>): CrudClient<TEntity, TCreate, TUpdate, TFilters, TId> {
  const base = basePath.replace(/\/+$/, "");

  const buildQuery = (
    params?: ListParams & TFilters
  ): string => {
    if (!params) {
      return "";
    }

    const searchParams = toSearchParams
      ? toSearchParams(params)
      : defaultToSearchParams(params);

    const query = searchParams.toString();

    return query ? `?${query}` : "";
  };

  const request = async <T>(
    path: string,
    init?: RequestInit
  ): Promise<T> => {
    const response = await apiFetch(`${base}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...init,
    });

    if (!response.ok) {
      throw await parseError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();

    return (text ? JSON.parse(text) : undefined) as T;
  };

  return {
    getAll: (params) =>
      request<PagedResult<TEntity>>(`${buildQuery(params)}`),

    getById: (id) =>
      request<TEntity>(
        `/${encodeURIComponent(String(id))}`
      ),

    create: (dto) =>
      request<TEntity>("", {
        method: "POST",
        body: JSON.stringify(dto),
      }),

    update: (id, dto) =>
      request<TEntity>(
        `/${encodeURIComponent(String(id))}`,
        {
          method: "PUT",
          body: JSON.stringify(dto),
        }
      ),

    remove: async (id) => {
      await request<void>(
        `/${encodeURIComponent(String(id))}`,
        { method: "DELETE" }
      );
    },
  };
}
