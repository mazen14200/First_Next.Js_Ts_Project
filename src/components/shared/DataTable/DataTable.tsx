"use client";

import type { ReactNode } from "react";
import { Spin } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import TablePagination from "@/components/ui/TablePagination/TablePagination";
import TableSkeleton from "@/components/shared/feedback/TableSkeleton";
import { displayValue } from "@/utils/display-value";

import type {
  DataTableColumn,
  DataTableProps,
} from "@/components/shared/DataTable/DataTable.types";

const PILL_CLASSES =
  "inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white";

const WIDTH_PATTERN = /(\d+(?:\.\d+)?)%/;

function sumExplicitWidths<T>(
  columns: DataTableColumn<T>[]
): number {
  return columns.reduce((total, column) => {
    const match = column.width?.match(WIDTH_PATTERN);

    return match ? total + Number(match[1]) : total;
  }, 0);
}

function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  refreshing = false,
  onEdit,
  onDelete,
  rowActions,
  getRowLabel,
  labels,
  pagination,
  minWidth = "min-w-[700px]",
}: DataTableProps<T>) {
  const hasActions = Boolean(
    onEdit || onDelete || rowActions
  );

  if (process.env.NODE_ENV === "development") {
    const explicitTotal = sumExplicitWidths(columns);

    if (explicitTotal >= 100) {
      console.warn(
        `[DataTable] Explicit column widths sum to ${explicitTotal}%. ` +
          "They must stay below 100% so the last column can take the remainder."
      );
    }
  }

  const alignClass = (align?: "start" | "center" | "end") =>
    align === "start"
      ? "text-start"
      : align === "end"
        ? "text-end"
        : "text-center";

  const renderCell = (
    column: DataTableColumn<T>,
    row: T,
    index: number
  ): ReactNode => {
    if (column.cell) {
      const cellResult = column.cell(row, index);

      if (
        cellResult === null ||
        cellResult === undefined ||
        typeof cellResult === "string" ||
        typeof cellResult === "number" ||
        typeof cellResult === "boolean"
      ) {
        return displayValue(cellResult);
      }

      return cellResult;
    }

    const value = column.accessor
      ? row[column.accessor]
      : undefined;

    const text = displayValue(value);

    const content = column.pill ? (
      <span className={PILL_CLASSES}>{text}</span>
    ) : (
      text
    );

    if (column.maxWidth) {
      return (
        <span
          className="inline-flex max-w-full rounded-lg px-2.5 py-1.5 text-sm text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white"
          style={{ maxWidth: column.maxWidth }}
        >
          <span className="truncate" title={String(text)}>
            {content}
          </span>
        </span>
      );
    }

    return content;
  };

  const renderHeader = (header: ReactNode): ReactNode => {
    if (
      typeof header === "string" &&
      header.trim() === ""
    ) {
      return "—";
    }

    return header;
  };

  const renderActions = (row: T): ReactNode[] => {
    const actions: ReactNode[] = [];

    const custom = rowActions?.(row);

    if (custom) {
      actions.push(custom);
    }

    if (onEdit) {
      const label = getRowLabel?.(row);

      actions.push(
        <button
          key="edit"
          type="button"
          aria-label={
            label ? `${labels.edit} ${label}` : labels.edit
          }
          title={labels.edit}
          onClick={() => onEdit(row)}
          className="flex h-9 w-10 cursor-pointer items-center justify-center bg-[#eaf3f8] text-[#1470ad] transition-all duration-200 hover:bg-[#0f5f91] hover:text-white"
        >
          <EditOutlined className="text-[15px]" />
        </button>
      );
    }

    if (onDelete) {
      const label = getRowLabel?.(row);

      actions.push(
        <button
          key="delete"
          type="button"
          aria-label={
            label
              ? `${labels.delete} ${label}`
              : labels.delete
          }
          title={labels.delete}
          onClick={() => onDelete(row)}
          className="flex h-9 w-10 cursor-pointer items-center justify-center bg-[#fff0f0] text-[#ff0000] transition-all duration-200 hover:bg-[#ff0000] hover:text-white"
        >
          <DeleteOutlined className="text-[15px]" />
        </button>
      );
    }

    return actions;
  };

  if (loading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <TableSkeleton columns={columns.length + (hasActions ? 1 : 0)} />
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-lg">
      {refreshing && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center bg-white/40 pt-16">
          <Spin />
        </div>
      )}

      <div className="overflow-x-auto">
        <table
          className={`w-full ${minWidth} border-collapse text-center`}
        >
          <colgroup>
            {columns.map((column) => (
              <col
                key={column.key}
                style={
                  column.width
                    ? { width: column.width }
                    : undefined
                }
              />
            ))}
            {hasActions && <col />}
          </colgroup>

          <thead>
            <tr className="bg-[#1470ad]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`border-b border-e border-white/20 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white ${alignClass(column.align)}`}
                >
                  {renderHeader(column.header)}
                </th>
              ))}

              {hasActions && (
                <th className="border-b border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  {labels.actions}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const actions = renderActions(row);

              return (
                <tr
                  key={rowKey(row)}
                  className="group border-b border-slate-200 transition-colors duration-200 odd:bg-white even:bg-slate-50 hover:bg-[#1470ad]/5"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`border-e border-slate-200 px-6 py-5 ${alignClass(column.align)}`}
                    >
                      {renderCell(column, row, index)}
                    </td>
                  ))}

                  {hasActions && (
                    <td className="px-6 py-5">
                      <div className="mx-auto flex w-fit items-center overflow-hidden rounded-xl border border-[#cbd6de] bg-white shadow-[0_3px_10px_rgba(8,29,56,0.07)] transition-all duration-200 group-hover:border-[#aebfc9] group-hover:shadow-[0_5px_16px_rgba(8,29,56,0.10)]">
                        {actions.map((action, actionIndex) => (
                          <span
                            key={actionIndex}
                            className="contents"
                          >
                            {actionIndex > 0 && (
                              <span className="h-5 w-px bg-[#cbd6de]" />
                            )}
                            {action}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <span className="text-lg">—</span>
            </div>

            <p className="mt-4 text-sm font-medium text-slate-700">
              {labels.emptyTitle}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {labels.emptyDescription}
            </p>
          </div>
        )}
      </div>

      {pagination && rows.length > 0 && (
        <TablePagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </section>
  );
}

export default DataTable;
