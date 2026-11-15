import { NextRequest, NextResponse } from "next/server";

import type { ListParams } from "@/types/crud.types";
import type { ValidationResult } from "@/types/validation.types";

import { authErrorResponse } from "@/lib/api/auth-error-response";
import { validationErrorResponse } from "@/lib/api/error-response";
import {
  InvalidQueryError,
  invalidBodyResponse,
  invalidIdResponse,
  invalidPaginationResponse,
  invalidQueryResponse,
  parseId,
  parseJsonBody,
  parsePagination,
  toErrorResponse,
} from "@/lib/api/route-helpers";

import type { CrudService } from "@/services/crud/createCrudService";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export interface CrudRoutesOptions<
  TEntity,
  TCreate,
  TUpdate,
  TFilters extends object,
  TId extends number | string,
> {
  service: CrudService<TEntity, TCreate, TUpdate, TFilters, TId>;
  entityName: string;
  parseFilters?: (
    searchParams: URLSearchParams
  ) => TFilters;
  validateCreate?: (body: unknown) => ValidationResult;
  validateUpdate?: (body: unknown) => ValidationResult;
  parseIdParam?: (id: string) => TId | null;
  maxPageSize?: number;
  createStatus?: number;
}

export function createCrudRoutes<
  TEntity,
  TCreate,
  TUpdate = TCreate,
  TFilters extends object = Record<string, never>,
  TId extends number | string = number,
>({
  service,
  entityName,
  parseFilters,
  validateCreate,
  validateUpdate,
  parseIdParam,
  maxPageSize,
  createStatus = 201,
}: CrudRoutesOptions<TEntity, TCreate, TUpdate, TFilters, TId>) {
  const resolveId = (id: string): TId | null => {
    if (parseIdParam) {
      return parseIdParam(id);
    }

    const parsed = parseId(id);

    return parsed === null ? null : (parsed as TId);
  };

  const validateBody = (
    body: unknown,
    validator?: (body: unknown) => ValidationResult
  ): NextResponse | null => {
    if (!validator) {
      return null;
    }

    const result = validator(body);

    if (result.valid) {
      return null;
    }

    return validationErrorResponse(result.fieldErrors);
  };

  const collection = {
    async GET(request: NextRequest) {
      try {
        const { searchParams } = new URL(request.url);

        const pagination = parsePagination(
          searchParams,
          maxPageSize
        );

        if (!pagination) {
          return invalidPaginationResponse();
        }

        let filters: TFilters;

        try {
          filters = parseFilters
            ? parseFilters(searchParams)
            : ({} as TFilters);
        } catch (filterError) {
          if (filterError instanceof InvalidQueryError) {
            return invalidQueryResponse(filterError.param);
          }

          throw filterError;
        }

        const search =
          searchParams.get("Search")?.trim() ?? "";

        const result = await service.getAll({
          ...pagination,
          search,
          ...filters,
        } as ListParams & TFilters);

        return NextResponse.json(result);
      } catch (error) {
        const authResponse = authErrorResponse(error);
        if (authResponse) return authResponse;
        console.error(
          `GET /api/${entityName} failed:`,
          error
        );

        return toErrorResponse(
          error,
          `Failed to fetch ${entityName}s.`
        );
      }
    },

    async POST(request: NextRequest) {
      try {
        const parsed = await parseJsonBody(request);

        if (!parsed.ok) {
          return invalidBodyResponse();
        }

        const body: unknown = parsed.body;

        const validationResponse = validateBody(
          body,
          validateCreate
        );

        if (validationResponse) {
          return validationResponse;
        }

        const entity = await service.create(body as TCreate);

        return NextResponse.json(entity, {
          status: createStatus,
        });
      } catch (error) {
        const authResponse = authErrorResponse(error);
        if (authResponse) return authResponse;
        console.error(
          `POST /api/${entityName} failed:`,
          error
        );

        return toErrorResponse(
          error,
          `Failed to create ${entityName}.`
        );
      }
    },
  };

  const item = {
    async GET(
      _request: NextRequest,
      context: RouteContext
    ) {
      try {
        const { id } = await context.params;
        const entityId = resolveId(id);

        if (entityId === null) {
          return invalidIdResponse(entityName);
        }

        const entity = await service.getById(entityId);

        return NextResponse.json(entity);
      } catch (error) {
        const authResponse = authErrorResponse(error);
        if (authResponse) return authResponse;
        console.error(
          `GET /api/${entityName}/[id] failed:`,
          error
        );

        return toErrorResponse(
          error,
          `Failed to fetch ${entityName}.`
        );
      }
    },

    async PUT(
      request: NextRequest,
      context: RouteContext
    ) {
      try {
        const { id } = await context.params;
        const entityId = resolveId(id);

        if (entityId === null) {
          return invalidIdResponse(entityName);
        }

        const parsed = await parseJsonBody(request);

        if (!parsed.ok) {
          return invalidBodyResponse();
        }

        const body: unknown = parsed.body;

        const validationResponse = validateBody(
          body,
          validateUpdate
        );

        if (validationResponse) {
          return validationResponse;
        }

        const entity = await service.update(
          entityId,
          body as TUpdate
        );

        if (entity !== undefined) {
          return NextResponse.json(entity);
        }

        return new NextResponse(null, { status: 204 });
      } catch (error) {
        const authResponse = authErrorResponse(error);
        if (authResponse) return authResponse;
        console.error(
          `PUT /api/${entityName}/[id] failed:`,
          error
        );

        return toErrorResponse(
          error,
          `Failed to update ${entityName}.`
        );
      }
    },

    async DELETE(
      _request: NextRequest,
      context: RouteContext
    ) {
      try {
        const { id } = await context.params;
        const entityId = resolveId(id);

        if (entityId === null) {
          return invalidIdResponse(entityName);
        }

        await service.remove(entityId);

        return new NextResponse(null, { status: 204 });
      } catch (error) {
        const authResponse = authErrorResponse(error);
        if (authResponse) return authResponse;
        console.error(
          `DELETE /api/${entityName}/[id] failed:`,
          error
        );

        return toErrorResponse(
          error,
          `Failed to delete ${entityName}.`
        );
      }
    },
  };

  return { collection, item };
}
