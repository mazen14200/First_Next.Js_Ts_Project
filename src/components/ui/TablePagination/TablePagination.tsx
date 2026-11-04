"use client";

import { Pagination } from "antd";
import { useLocale, useTranslations } from "next-intl";

import styles from "./TablePagination.module.css";

interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const TablePagination = ({
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) => {
  const locale = useLocale();
  const t = useTranslations("tableHeader");

  if (total === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Pagination */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        showSizeChanger={false}
        showQuickJumper={false}
        responsive
        onChange={onPageChange}
        className={styles.pagination}
        locale={{
          items_per_page:
            locale === "ar" ? "لكل صفحة" : "/ page",
          jump_to: locale === "ar" ? "اذهب إلى" : "Go to",
          page: locale === "ar" ? "صفحة" : "Page",
        }}
      />
    </div>
  );
};

export default TablePagination;
