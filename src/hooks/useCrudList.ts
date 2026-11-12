"use client";

import { useEffect, useRef, useState } from "react";

import type {
  ListParams,
  PagedResult,
} from "@/types/crud.types";

import type { CrudClient } from "@/services/crud/createCrudClient";

export type CrudErrorAction =
  | "load"
  | "create"
  | "update"
  | "delete";

interface UseCrudListOptions<
  TEntity extends { id: TId },
  TCreate,
  TUpdate,
  TFilters extends object,
  TId extends number | string,
> {
  client: CrudClient<TEntity, TCreate, TUpdate, TFilters, TId>;
  initialPageSize?: number;
  initialFilters?: TFilters;
  onError?: (error: unknown, action: CrudErrorAction) => void;
}

const defaultOnError = (error: unknown) => {
  console.error(error);
};

export function useCrudList<
  TEntity extends { id: TId },
  TCreate,
  TUpdate = TCreate,
  TFilters extends object = Record<string, never>,
  TId extends number | string = number,
>({
  client,
  initialPageSize = 10,
  initialFilters = {} as TFilters,
  onError = defaultOnError,
}: UseCrudListOptions<
  TEntity,
  TCreate,
  TUpdate,
  TFilters,
  TId
>) {
  const [items, setItems] = useState<TEntity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const [draftFilters, setDraftFiltersState] =
    useState<TFilters>(initialFilters);
  const [reloadToken, setReloadToken] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [formEntity, setFormEntity] = useState<TEntity | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [removeTarget, setRemoveTarget] = useState<TEntity | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const hasLoadedRef = useRef(false);
  const requestSeqRef = useRef(0);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  });

  useEffect(() => {
    const requestId = ++requestSeqRef.current;

    const load = async () => {
      const isFirstLoad = !hasLoadedRef.current;

      if (isFirstLoad) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      try {
        const result: PagedResult<TEntity> =
          await client.getAll({
            pageNumber: page,
            pageSize,
            search,
            ...filters,
          } as ListParams & TFilters);

        if (requestId !== requestSeqRef.current) {
          return;
        }

        setItems(result.items ?? []);
        setTotalCount(result.totalCount ?? 0);
        setTotalPages(result.totalPages ?? 0);
        hasLoadedRef.current = true;
      } catch (err) {
        if (requestId !== requestSeqRef.current) {
          return;
        }

        setError(err);
        onErrorRef.current(err, "load");
      } finally {
        if (requestId === requestSeqRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    load();
  }, [client, page, pageSize, search, filters, reloadToken]);

  const reload = () => {
    setReloadToken((token) => token + 1);
  };

  const setDraftFilters = (patch: Partial<TFilters>) => {
    setDraftFiltersState((current) => ({
      ...current,
      ...patch,
    }));
  };

  const apply = (searchText: string) => {
    setSearch(searchText.trim());
    setFilters(draftFilters);
    setPage(1);
  };

  const reset = () => {
    setSearch("");
    setFilters(initialFilters);
    setDraftFiltersState(initialFilters);
    setPage(1);
  };

  const openCreate = () => {
    setFormEntity(null);
    setFormOpen(true);
  };

  const openEdit = (entity: TEntity) => {
    setFormEntity(entity);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormEntity(null);
  };

  const submit = async (
    payload: TCreate | TUpdate
  ): Promise<void> => {
    setIsSaving(true);

    try {
      if (formEntity) {
        await client.update(
          formEntity.id,
          payload as TUpdate
        );
      } else {
        await client.create(payload as TCreate);
      }

      closeForm();
      reload();
    } catch (err) {
      onErrorRef.current(err, formEntity ? "update" : "create");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (entity: TEntity) => {
    setRemoveTarget(entity);
  };

  const cancelDelete = () => {
    if (isDeleting) {
      return;
    }

    setRemoveTarget(null);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!removeTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await client.remove(removeTarget.id);

      setRemoveTarget(null);

      if (items.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        reload();
      }
    } catch (err) {
      onErrorRef.current(err, "delete");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    data: {
      items,
      totalCount,
      totalPages,
    },
    status: {
      loading,
      refreshing,
      error,
    },
    query: {
      page,
      pageSize,
      search,
      filters,
      draftFilters,
    },
    actions: {
      setPage,
      setPageSize: (size: number) => {
        setPageSize(size);
        setPage(1);
      },
      setDraftFilters,
      apply,
      reset,
      reload,
    },
    form: {
      open: formOpen,
      entity: formEntity,
      isSaving,
      openCreate,
      openEdit,
      close: closeForm,
      submit,
    },
    remove: {
      target: removeTarget,
      isDeleting,
      request: requestDelete,
      cancel: cancelDelete,
      confirm: confirmDelete,
    },
  };
}
