import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  accessor?: keyof T;
  cell?: (row: T, index: number) => ReactNode;
  width?: string;
  align?: "start" | "center" | "end";
  pill?: boolean;
  maxWidth?: number;
}

export interface DataTablePagination {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface DataTableLabels {
  actions: string;
  edit: string;
  delete: string;
  emptyTitle: string;
  emptyDescription: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  refreshing?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  rowActions?: (row: T) => ReactNode;
  getRowLabel?: (row: T) => string;
  labels: DataTableLabels;
  pagination?: DataTablePagination;
  minWidth?: string;
}
