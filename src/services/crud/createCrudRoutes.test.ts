import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { createCrudRoutes } from "./createCrudRoutes";

import type { CrudService } from "./createCrudService";

interface TestEntity {
  id: number;
  name: string;
}

const createService = (): CrudService<
  TestEntity,
  { name: string },
  { name: string },
  Record<string, never>,
  number
> => ({
  getAll: vi.fn(async () => ({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  })),
  getById: vi.fn(async (id) => ({ id, name: "x" })),
  create: vi.fn(async (dto) => ({ id: 1, name: dto.name })),
  update: vi.fn(async (id) => ({ id, name: "x" })),
  remove: vi.fn(async () => {}),
  search: vi.fn(async () => ({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  })),
});

const routesFor = (service: ReturnType<typeof createService>) =>
  createCrudRoutes({
    service,
    entityName: "widget",
  });

const postRequest = (body: string) =>
  new NextRequest("http://localhost/api/widgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

describe("createCrudRoutes", () => {
  it("returns 400 for malformed JSON on POST", async () => {
    const routes = routesFor(createService());
    const response = await routes.collection.POST(
      postRequest("{not-json")
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.code).toBe("INVALID_REQUEST");
  });

  it("returns 400 for empty body on POST", async () => {
    const routes = routesFor(createService());
    const response = await routes.collection.POST(
      postRequest("")
    );

    expect(response.status).toBe(400);
  });

  it("creates entity for valid JSON on POST", async () => {
    const service = createService();
    const routes = routesFor(service);
    const response = await routes.collection.POST(
      postRequest('{"name":"ok"}')
    );

    expect(response.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith({ name: "ok" });
  });

  it("returns 400 for malformed JSON on PUT", async () => {
    const routes = routesFor(createService());
    const request = new NextRequest(
      "http://localhost/api/widgets/1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: "broken",
      }
    );

    const response = await routes.item.PUT(request, {
      params: Promise.resolve({ id: "1" }),
    });

    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid pagination", async () => {
    const routes = routesFor(createService());
    const request = new NextRequest(
      "http://localhost/api/widgets?PageNumber=0&PageSize=10"
    );

    const response = await routes.collection.GET(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.code).toBe("INVALID_PAGINATION");
  });

  it("returns 400 for invalid id", async () => {
    const routes = routesFor(createService());
    const request = new NextRequest(
      "http://localhost/api/widgets/abc"
    );

    const response = await routes.item.GET(request, {
      params: Promise.resolve({ id: "abc" }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.code).toBe("INVALID_ID");
  });
});
