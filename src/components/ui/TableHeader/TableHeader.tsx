"use client";

import {
  FormEvent,
  ReactNode,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import {
  DownloadOutlined,
  PlusOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import FilterSelect from "@/components/ui/FilterSelect/FilterSelect";
import styles from "@/components/ui/TableHeader/TableHeader.module.css";

interface TableHeaderProps {
  title: string;
  description?: string;
  recordCount?: number;
  currentPage: number;

  filters?: ReactNode;

  showSearch?: boolean;
  showPagination?: boolean;

  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;

  onApplyFilters?: (searchValue: string) => void;
  onResetFilters?: () => void;

  onPrint?: () => void;
  onExportExcel?: () => void;
  onAdd?: () => void;
}

const TableHeader = ({
  title,
  description,
  recordCount,
  currentPage: _currentPage,
  filters,

  showSearch = true,
  showPagination = true,

  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
  onApplyFilters,
  onResetFilters,
  onPrint,
  onExportExcel,
  onAdd,
}: TableHeaderProps) => {
  const t = useTranslations("tableHeader");

  const [searchValue, setSearchValue] = useState("");

  const handleApplyFilters = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    onApplyFilters?.(searchValue.trim());
  };

  const handleResetFilters = () => {
    setSearchValue("");
    onResetFilters?.();
  };

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border border-[#d2d8dc]
        bg-white
        shadow-[0_14px_40px_rgba(8,29,56,0.10)]
      "
    >
      {/* =========================
          Header Top
      ========================== */}
      <div className="bg-white px-5 pt-5 sm:px-6 sm:pt-6">
        {/* Breadcrumb + Record Count */}
        <div className="mb-5 flex items-center justify-between gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-[#718391] transition-colors hover:text-[#1470ad]">
              <Link href="/">
                {t("home")}
              </Link>
            </span>

            <span className="text-[#b8c5ce]">/</span>

            <span className="font-bold text-[#f37828]">
              {title}
            </span>
          </div>

          {/* Record Count */}
          {recordCount !== undefined && (
            <div
              className="
                inline-flex
                shrink-0
                items-center
                gap-2
                rounded-xl
                border
                border-[#cbd7df]
                bg-[#f1f4f6]
                px-3
                py-1.5
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-[#f37828]
                  shadow-[0_0_0_3px_rgba(243,120,40,0.12)]
                "
              />

              <span
                className="
                  whitespace-nowrap
                  text-xs
                  font-bold
                  text-[#506675]
                "
              >
                {t("recordCount")}
              </span>

              <span
                className="
                  flex
                  h-7
                  min-w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#173b52]
                  px-2
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_3px_8px_rgba(23,59,82,0.18)]
                "
              >
                {recordCount}
              </span>
            </div>
          )}
        </div>

        {/* Title + Actions */}
        <div
          className="
            flex
            flex-col
            gap-5
            border-b
            border-[#dce4e9]
            pb-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Title */}
          <div className="flex items-start gap-4">
            <div
              className="
                mt-1
                hidden
                h-11
                w-1
                rounded-full
                bg-[#f37828]
                shadow-[0_0_12px_rgba(243,120,40,0.18)]
                sm:block
              "
            />

            <div>
              <h1
                className="
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-[#081d38]
                "
              >
                {title}
              </h1>

              {description && (
                <p
                  className="
                    mt-1.5
                    max-w-2xl
                    text-sm
                    font-medium
                    leading-6
                    text-[#637887]
                  "
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Add */}
            {onAdd && (
              <div className={styles.addButtonWrapper}>
                <button
                  type="button"
                  onClick={onAdd}
                  className={styles.actionButton}
                >
                  <span className={styles.shine} />

                  <PlusOutlined className="relative z-10 text-sm" />

                  <span className="relative z-10">
                    {t("add")}
                  </span>
                </button>
              </div>
            )}

            {/* Print */}
            <button
              type="button"
              onClick={onPrint}
              className={styles.printButton}
            >
              <span className={styles.shine} />

              <PrinterOutlined className="relative z-10 text-sm" />

              <span className="relative z-10">
                {t("print")}
              </span>
            </button>

            {/* Export */}
            <button
              type="button"
              onClick={onExportExcel}
              className={styles.outlineActionButton}
            >
              <span className={styles.shine} />

              <DownloadOutlined className="relative z-10 text-sm" />

              <span className="relative z-10">
                {t("exportExcel")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================
          Search + Filters
      ========================== */}
      <div
        className="
          relative
          overflow-hidden
          border-b
          border-[#c8d4dc]
          bg-[#eef2f5]
          px-5
          py-5
          sm:px-6
        "
      >
        {/* Decorative Background - LTR */}
        <div className="pointer-events-none absolute inset-0 rtl:hidden">
          <div
            className="
              absolute
              -right-28
              -top-36
              h-80
              w-80
              rounded-full
              border-[24px]
              border-[#1470ad]/[0.055]
            "
          />

          <div
            className="
              absolute
              -right-5
              -top-14
              h-52
              w-52
              rounded-full
              border
              border-[#f37828]/[0.13]
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -left-40
              h-80
              w-80
              rounded-full
              border-[20px]
              border-[#081d38]/[0.035]
            "
          />
        </div>

        {/* Decorative Background - RTL */}
        <div className="pointer-events-none absolute inset-0 hidden rtl:block">
          <div
            className="
              absolute
              -left-28
              -top-36
              h-80
              w-80
              rounded-full
              border-[24px]
              border-[#1470ad]/[0.055]
            "
          />

          <div
            className="
              absolute
              -left-5
              -top-14
              h-52
              w-52
              rounded-full
              border
              border-[#f37828]/[0.13]
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -right-40
              h-80
              w-80
              rounded-full
              border-[20px]
              border-[#081d38]/[0.035]
            "
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <form onSubmit={handleApplyFilters}>
            <div
              className="
                flex
                w-full
                flex-col
                items-stretch
                gap-3
                lg:flex-row
                lg:items-end
                [&>*]:min-w-0
                [&>*]:flex-1
              "
            >
              {/* Search */}
              {showSearch && (
                <div className="w-full min-w-0">
                  <div className="mb-2 flex items-center justify-start">
                    <label
                      className="
                        font-['mainFont',sans-serif]
                        text-[12px]
                        font-extrabold
                        tracking-[0.02em]
                        text-[#304b5d]
                      "
                    >
                      {t("searchLabel")}
                    </label>
                  </div>

                  <div className="relative">
                    <SearchOutlined
                      className="
                        pointer-events-none
                        absolute
                        end-3
                        top-1/2
                        z-10
                        -translate-y-1/2
                        text-sm
                        text-[#1470ad]
                      "
                    />

                    <input
                      type="text"
                      value={searchValue}
                      onChange={(event) =>
                        setSearchValue(event.target.value)
                      }
                      placeholder={t("search")}
                      className="
                        box-border
                        h-[40px]
                        w-full
                        rounded-[8px]
                        border
                        border-[#aebfc9]
                        bg-white
                        ps-3
                        pe-9
                        text-sm
                        font-semibold
                        text-[#1d3545]
                        outline-none
                        shadow-[0_2px_6px_rgba(8,29,56,0.06)]
                        transition-all
                        duration-200
                        placeholder:font-medium
                        placeholder:text-[#82929d]
                        hover:border-[#8099a9]
                        focus:border-[#1470ad]
                        focus:ring-2
                        focus:ring-[#1470ad]/15
                      "
                    />
                  </div>
                </div>
              )}

              {/* Filters */}
              {filters}
            </div>

            {/* Filter Actions */}
            <div
              className="
                mt-5
                flex
                items-center
                justify-end
                gap-3
              "
            >
              {/* Reset */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="
                  inline-flex
                  h-10
                  min-w-[145px]
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#9eafb9]
                  bg-white
                  px-6
                  text-sm
                  font-bold
                  text-[#435c6b]
                  shadow-[0_2px_6px_rgba(8,29,56,0.05)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#718996]
                  hover:bg-[#f9fafb]
                  hover:text-[#263f50]
                  hover:shadow-[0_8px_18px_rgba(8,29,56,0.09)]
                  active:translate-y-0
                  cursor-pointer
                "
              >
                {t("reset")}
              </button>

              {/* Submit */}
              <button
                type="submit"
                className={`
                  ${styles.submitButton}
                  min-w-[145px]
                `}
              >
                <span className={styles.shine} />

                <SearchOutlined className="relative z-10 text-sm" />

                <span className="relative z-10">
                  {t("submit")}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* =========================
          Records Per Page
      ========================== */}
      {showPagination && (
        <div
          className="
            flex
            items-center
            justify-start
            gap-4
            bg-white
            px-5
            py-4
            sm:px-6
          "
        >
          <div className="flex items-center gap-2">
            <span
              className="
                whitespace-nowrap
                text-sm
                font-bold
                text-[#506675]
              "
            >
              {t("recordsPerPage")}
            </span>

            <FilterSelect
              compact
              value={String(pageSize)}
              onChange={(value) =>
                onPageSizeChange?.(Number(value))
              }
              options={pageSizeOptions.map((option) => ({
                value: String(option),
                label: String(option),
              }))}
              aria-label={t("recordsPerPage")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableHeader;