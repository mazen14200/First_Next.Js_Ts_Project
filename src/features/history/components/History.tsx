"use client";

import {
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import TableHeader from "../../../components/ui/TableHeader/TableHeader";
import TablePagination from "../../../components/ui/TablePagination/TablePagination";
import FilterSelect from "../../../components/ui/FilterSelect/FilterSelect";
import DatePicker from "../../../components/ui/DatePicker/DatePicker";

import HistoryTimeline from "./HistoryTimeline";
import HistoryTable from "./HistoryTable";

import type {
  HistoryFilters,
  HistoryItem,
  PaginatedHistoryResponse,
} from "../types/history.types";

interface HistoryTimelineProps {
  users?: {
    id: string;
    name: string;
  }[];
}

type HistoryView = "table" | "timeline";

const History = ({
  users = [],
}: HistoryTimelineProps) => {
  const t = useTranslations("history");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(true);

  const [operationKeyId, setOperationKeyId] =
    useState("");

  const [userId, setUserId] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [appliedFilters, setAppliedFilters] =
    useState<HistoryFilters>({
      pageNumber: 1,
      pageSize: 10,
    });

  const [view, setView] =
    useState<HistoryView>("table");

  const operationOptions = [
    {
      value: "",
      label: t("allOperations"),
    },
    {
      value: "3",
      label: t("view"),
    },
  ];

  const userOptions = [
    {
      value: "",
      label: t("allUsers"),
    },
    ...users.map((user) => ({
      value: user.id,
      label: user.name,
    })),
  ];

  /*
   * Fetch History
   *
   * This function only fetches data.
   * It does not update React state.
   */
  const fetchHistory = async (
    filters: HistoryFilters
  ): Promise<PaginatedHistoryResponse> => {
    const params = new URLSearchParams();

    if (filters.operationKeyId !== undefined) {
      params.set(
        "OperationKeyId",
        String(filters.operationKeyId)
      );
    }

    if (filters.userId) {
      params.set("UserId", filters.userId);
    }

    /*
     * DatePicker returns:
     * YYYY-MM-DD
     *
     * History API expects RFC 3339.
     */
    if (filters.fromDate) {
      params.set(
        "FromDate",
        `${filters.fromDate}T00:00:00Z`
      );
    }

    if (filters.toDate) {
      params.set(
        "ToDate",
        `${filters.toDate}T23:59:59Z`
      );
    }

    params.set(
      "PageNumber",
      String(filters.pageNumber ?? 1)
    );

    params.set(
      "PageSize",
      String(filters.pageSize ?? 10)
    );

    if (filters.search?.trim()) {
      params.set(
        "Search",
        filters.search.trim()
      );
    }

    const response = await fetch(
      `/api/history?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch history"
      );
    }

    return response.json();
  };

  /*
   * Initial History Load
   */
  useEffect(() => {
    let cancelled = false;

    const loadInitialHistory = async () => {
      try {
        setLoading(true);

        const data = await fetchHistory({
          pageNumber: 1,
          pageSize: 10,
        });

        if (cancelled) {
          return;
        }

        setHistory(data.items ?? []);
        setTotal(data.totalCount ?? 0);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load history:",
          error
        );

        setHistory([]);
        setTotal(0);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Load History
   *
   * Used by filters, pagination and page size changes.
   */
  const loadHistory = async (
    filters: HistoryFilters
  ) => {
    try {
      setLoading(true);

      const data = await fetchHistory(filters);

      setHistory(data.items ?? []);
      setTotal(data.totalCount ?? 0);
    } catch (error) {
      console.error(
        "Failed to load history:",
        error
      );

      setHistory([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Apply Search + Filters
   */
  const handleApplyFilters = (
    searchValue: string
  ) => {
    const filters: HistoryFilters = {
      pageNumber: 1,
      pageSize,

      operationKeyId: operationKeyId
        ? Number(operationKeyId)
        : undefined,

      userId: userId || undefined,

      fromDate:
        fromDate || undefined,

      toDate:
        toDate || undefined,

      search:
        searchValue.trim() || undefined,
    };

    setPage(1);

    setAppliedFilters(filters);

    loadHistory(filters);
  };

  /*
   * Reset Search + Filters
   */
  const handleResetFilters = () => {
    setOperationKeyId("");
    setUserId("");
    setFromDate("");
    setToDate("");

    const filters: HistoryFilters = {
      pageNumber: 1,
      pageSize,
    };

    setPage(1);

    setAppliedFilters(filters);

    loadHistory(filters);
  };

  /*
   * Page Change
   */
  const handlePageChange = (
    nextPage: number
  ) => {
    setPage(nextPage);

    const filters: HistoryFilters = {
      ...appliedFilters,
      pageNumber: nextPage,
      pageSize,
    };

    setAppliedFilters(filters);

    loadHistory(filters);
  };

  /*
   * Page Size Change
   */
  const handlePageSizeChange = (
    nextPageSize: number
  ) => {
    setPageSize(nextPageSize);

    setPage(1);

    const filters: HistoryFilters = {
      ...appliedFilters,
      pageNumber: 1,
      pageSize: nextPageSize,
    };

    setAppliedFilters(filters);

    loadHistory(filters);
  };

  return (
    <div className="space-y-5">
      {/* =========================
          Table Header
      ========================== */}
      <TableHeader
        title={t("title")}
        description={t("description")}
        recordCount={total}
        currentPage={page}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20, 50]}
        onPageSizeChange={
          handlePageSizeChange
        }
        onApplyFilters={
          handleApplyFilters
        }
        onResetFilters={
          handleResetFilters
        }
        filters={
          <>
            <FilterSelect
              label={t("operation")}
              value={operationKeyId}
              options={operationOptions}
              onChange={
                setOperationKeyId
              }
            />

            <FilterSelect
              label={t("user")}
              value={userId}
              options={userOptions}
              onChange={setUserId}
            />

            <DatePicker
              label={t("fromDate")}
              value={fromDate}
              onChange={setFromDate}
            />

            <DatePicker
              label={t("toDate")}
              value={toDate}
              onChange={setToDate}
            />
          </>
        }
      />

      {/* =========================
          View Switcher
      ========================== */}
      <div className="flex items-center justify-end">
        <div className="inline-flex items-center rounded-xl border border-[#d9e1e7] bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() =>
              setView("table")
            }
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              view === "table"
                ? "bg-[#1470ad] text-white shadow-sm"
                : "text-[#64748b] hover:bg-[#f4f7f9] hover:text-[#1470ad]"
            }`}
          >
            <BarsOutlined />

            <span>
              {t("tableView")}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setView("timeline")
            }
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              view === "timeline"
                ? "bg-[#1470ad] text-white shadow-sm"
                : "text-[#64748b] hover:bg-[#f4f7f9] hover:text-[#1470ad]"
            }`}
          >
            <AppstoreOutlined />

            <span>
              {t("timelineView")}
            </span>
          </button>
        </div>
      </div>

      {/* =========================
          Content
      ========================== */}
      {loading ? (
        <div className="overflow-hidden rounded-2xl border border-[#d7e0e7] bg-white">
          <div className="space-y-4 p-6">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-[#f1f4f6]"
              />
            ))}
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#d7e0e7] bg-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[#081d38]">
              {t("emptyTitle")}
            </h3>

            <p className="mt-2 text-sm text-[#7b8794]">
              {t("emptyDescription")}
            </p>
          </div>
        </div>
      ) : view === "table" ? (
        <HistoryTable
          history={history}
        />
      ) : (
        <div className="rounded-2xl border border-[#d7e0e7] bg-[#f7f9fa] p-6">
          <div className="space-y-6">
            {history.map((item, index) => (
              <HistoryTimeline
                key={item.id}
                item={item}
                position={index % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>
      )}

      {/* =========================
          Pagination
      ========================== */}
      {!loading &&
        history.length > 0 && (
          <TablePagination
            currentPage={page}
            pageSize={pageSize}
            total={total}
            onPageChange={
              handlePageChange
            }
            onPageSizeChange={
              handlePageSizeChange
            }
          />
        )}
    </div>
  );
};

export default History;