import { NextRequest, NextResponse } from "next/server";

import type { ListParams } from "@/types/crud.types";

import { authErrorResponse } from "@/lib/api/auth-error-response";
import {
  invalidIdResponse,
  invalidPaginationResponse,
  parseId,
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
  createStatus = 201,
}: CrudRoutesOptions<TEntity, TCreate, TUpdate, TFilters, TId>) {
  const collection = {
    async GET(request: NextRequest) {
      try {
        const { searchParams } = new URL(request.url);

        const pagination = parsePagination(searchParams);

        if (!pagination) {
          return invalidPaginationResponse();
        }

        const filters = parseFilters
          ? parseFilters(searchParams)
          : ({} as TFilters);

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
        const body = (await request.json()) as TCreate;

        const entity = await service.create(body);

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
        const entityId = parseId(id);

        if (entityId === null) {
          return invalidIdResponse(entityName);
        }

        const entity = await service.getById(
          entityId as TId
        );

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
        const entityId = parseId(id);

        if (entityId === null) {
          return invalidIdResponse(entityName);
        }

        const body = (await request.json()) as TUpdate;

        const entity = await service.update(
          entityId as TId,
          body
        );

        if (entity !== undefined) {
          return NextResponse.json(entity);
        }

        return NextResponse.json({
          message: `${entityName} updated successfully.`,
        });
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
        const entityId = parseId(id);

        if (entityId === null) {
          return invalidIdResponse(entityName);
        }

        await service.remove(entityId as TId);

        return NextResponse.json({
          message: `${entityName} deleted successfully.`,
        });
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
