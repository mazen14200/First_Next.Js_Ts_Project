import type { AxiosInstance } from "axios";

import serverApi from "../server-api";

import type {
  ListParams,
  PagedResult,
} from "../../types/crud.types";

export function defaultToQuery(
  params: ListParams
): Record<string, unknown> {
  const pageNumber = params.pageNumber ?? 1;
  const pageSize = params.pageSize ?? 10;
  const search = params.search?.trim() ?? "";

  return {
    PageNumber: pageNumber,
    PageSize: pageSize,
    ...(search && { Search: search }),
  };
}

export interface CrudService<TEntity, TCreate, TUpdate, TFilters, TId> {
  getAll: (
    params?: ListParams & TFilters
  ) => Promise<PagedResult<TEntity>>;
  getById: (id: TId) => Promise<TEntity>;
  create: (dto: TCreate) => Promise<TEntity>;
  update: (id: TId, dto: TUpdate) => Promise<TEntity | undefined>;
  remove: (id: TId) => Promise<void>;
  search: (
    term: string,
    params?: TFilters
  ) => Promise<PagedResult<TEntity>>;
}

interface CreateCrudServiceOptions<TFilters extends object> {
  endpoint: string;
  http?: AxiosInstance;
  toQuery?: (
    params: ListParams & TFilters
  ) => Record<string, unknown>;
}

export function createCrudService<
  TEntity,
  TCreate,
  TUpdate = TCreate,
  TFilters extends object = Record<string, never>,
  TId extends number | string = number,
>({
  endpoint,
  http = serverApi,
  toQuery = (params) => defaultToQuery(params),
}: CreateCrudServiceOptions<TFilters>): CrudService<TEntity, TCreate, TUpdate, TFilters, TId> {
  const base = endpoint.replace(/\/+$/, "");

  const service: CrudService<
    TEntity,
    TCreate,
    TUpdate,
    TFilters,
    TId
  > = {
    async getAll(params = {} as ListParams & TFilters) {
      const response = await http.get<PagedResult<TEntity>>(base, {
        params: toQuery(params),
      });

      return response.data;
    },

    async getById(id) {
      const response = await http.get<TEntity>(
        `${base}/${encodeURIComponent(String(id))}`
      );

      return response.data;
    },

    async create(dto) {
      const response = await http.post<TEntity>(base, dto);

      return response.data;
    },

    async update(id, dto) {
      const response = await http.put<TEntity | void>(
        `${base}/${encodeURIComponent(String(id))}`,
        dto
      );

      return response.data as TEntity | undefined;
    },

    async remove(id) {
      await http.delete(
        `${base}/${encodeURIComponent(String(id))}`
      );
    },

    async search(term, params = {} as TFilters) {
      return service.getAll({
        ...params,
        pageNumber: 1,
        search: term,
      } as ListParams & TFilters);
    },
  };

  return service;
}
