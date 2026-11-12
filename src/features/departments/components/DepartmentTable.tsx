"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import type {
  Department,
  PaginatedDepartmentsResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@/features/departments/types/department.types";

import DepartmentModal from "@/features/departments/components/DepartmentModal";
import DeleteDepartmentModal from "@/features/departments/components/DeleteDepartmentModal";

import TableHeader from "@/components/ui/TableHeader/TableHeader";
import TablePagination from "@/components/ui/TablePagination/TablePagination";

import { apiFetch } from "@/lib/api/client-fetch";

const DepartmentTable = () => {
  const locale = useLocale();
  const t = useTranslations("departments");

  const [paginatedResponse, setPaginatedResponse] =
    useState<PaginatedDepartmentsResponse | null>(null);

  const [loading, setLoading] = useState(true);

  /*
   * Applied Search
   *
   * This is the Search value actually sent to the API.
   */
  const [appliedSearch, setAppliedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartmentForEdit, setSelectedDepartmentForEdit] =
    useState<Department | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartmentForDelete, setSelectedDepartmentForDelete] =
    useState<Department | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDepartments = async (
    page: number,
    size: number,
    search: string
  ) => {
    const params = new URLSearchParams({
      PageNumber: String(page),
      PageSize: String(size),
    });

    if (search.trim()) {
      params.set("Search", search.trim());
    }

    const response = await apiFetch(
      `/api/department?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch departments");
    }

    const data: PaginatedDepartmentsResponse =
      await response.json();

    setPaginatedResponse(data);

    return data;
  };

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoading(true);

        await fetchDepartments(
          1,
          pageSize,
          appliedSearch
        );
      } catch (error) {
        console.error(
          "Failed to fetch departments:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      setCurrentPage(page);

      await fetchDepartments(
        page,
        pageSize,
        appliedSearch
      );
    } catch (error) {
      console.error(
        "Failed to fetch departments:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageSizeChange = async (size: number) => {
    try {
      setLoading(true);
      setPageSize(size);
      setCurrentPage(1);

      await fetchDepartments(
        1,
        size,
        appliedSearch
      );
    } catch (error) {
      console.error(
        "Failed to change department page size:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (search: string) => {
    const trimmedSearch = search.trim();

    try {
      setLoading(true);
      setAppliedSearch(trimmedSearch);
      setCurrentPage(1);

      await fetchDepartments(
        1,
        pageSize,
        trimmedSearch
      );
    } catch (error) {
      console.error(
        "Failed to apply department search:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    try {
      setLoading(true);

      setAppliedSearch("");
      setCurrentPage(1);

      await fetchDepartments(
        1,
        pageSize,
        ""
      );
    } catch (error) {
      console.error(
        "Failed to reset department search:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (
    data: CreateDepartmentRequest
  ): Promise<void> => {
    const response = await apiFetch("/api/department", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create department");
    }

    try {
      setLoading(true);

      await fetchDepartments(
        currentPage,
        pageSize,
        appliedSearch
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDepartment = async (
    id: number,
    data: UpdateDepartmentRequest
  ): Promise<void> => {
    const response = await apiFetch(
      `/api/department/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update department");
    }

    try {
      setLoading(true);

      await fetchDepartments(
        currentPage,
        pageSize,
        appliedSearch
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedDepartmentForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (
    department: Department
  ) => {
    setSelectedDepartmentForEdit(department);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartmentForEdit(null);
  };

  const handleOpenDeleteModal = (
    department: Department
  ) => {
    setSelectedDepartmentForDelete(department);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedDepartmentForDelete(null);
  };

  const handleDeleteDepartment = async (): Promise<void> => {
    if (!selectedDepartmentForDelete) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await apiFetch(
        `/api/department/${selectedDepartmentForDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete department");
      }

      await fetchDepartments(
        currentPage,
        pageSize,
        appliedSearch
      );

      setIsDeleteModalOpen(false);
      setSelectedDepartmentForDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete department:",
        error
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const departments = paginatedResponse?.items ?? [];

  const totalCount =
    paginatedResponse?.totalCount ?? 0;

  const safeCurrentPage =
    paginatedResponse?.pageNumber ?? currentPage;

  if (loading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="animate-pulse">
          <div className="border-b border-slate-100 px-6 py-6">
            <div className="h-6 w-40 rounded-lg bg-slate-100" />
            <div className="mt-3 h-4 w-64 rounded-lg bg-slate-100" />
          </div>

          <div className="space-y-0">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-100" />

                <div className="flex-1">
                  <div className="h-4 w-48 rounded bg-slate-100" />
                  <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
                </div>

                <div className="flex gap-2">
                  <div className="h-9 w-9 rounded-lg bg-slate-100" />
                  <div className="h-9 w-9 rounded-lg bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <TableHeader
          title={t("title")}
          description={t("description")}
          recordCount={totalCount}
          currentPage={safeCurrentPage}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          onPageSizeChange={handlePageSizeChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onAdd={handleOpenAddModal}
        />

        <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-center">
              <thead>
                <tr className="bg-[#1470ad]">
                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("department")}
                  </th>

                  <th className="w-56 border-b border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {departments.map((department) => {
                  const departmentName =
                    locale === "ar"
                      ? department.nameAR
                      : department.nameEN;

                  return (
                    <tr
                      key={department.id}
                      className="group border-b border-slate-200 transition-colors duration-200 odd:bg-white even:bg-slate-50 hover:bg-[#1470ad]/5"
                    >
                      <td className="border-e border-slate-200 px-6 py-5">
                        <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                          {departmentName}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="mx-auto flex w-fit items-center overflow-hidden rounded-xl border border-[#cbd6de] bg-white shadow-[0_3px_10px_rgba(8,29,56,0.07)] transition-all duration-200 group-hover:border-[#aebfc9] group-hover:shadow-[0_5px_16px_rgba(8,29,56,0.10)]">
                          <button
                            type="button"
                            aria-label={`${t("edit")} ${departmentName}`}
                            title={t("edit")}
                            onClick={() =>
                              handleOpenEditModal(department)
                            }
                            className="flex h-9 w-10 cursor-pointer items-center justify-center bg-[#eaf3f8] text-[#1470ad] transition-all duration-200 hover:bg-[#0f5f91] hover:text-white"
                          >
                            <EditOutlined className="text-[15px]" />
                          </button>

                          <span className="h-5 w-px bg-[#cbd6de]" />

                          <button
                            type="button"
                            aria-label={`${t("delete")} ${departmentName}`}
                            title={t("delete")}
                            onClick={() =>
                              handleOpenDeleteModal(department)
                            }
                            className="flex h-9 w-10 cursor-pointer items-center justify-center bg-[#fff0f0] text-[#ff0000] transition-all duration-200 hover:bg-[#ff0000] hover:text-white"
                          >
                            <DeleteOutlined className="text-[15px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {departments.length === 0 && (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <span className="text-lg">—</span>
                </div>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  {t("emptyTitle")}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {t("emptyDescription")}
                </p>
              </div>
            )}
          </div>

        </section>
      </div>

      <DepartmentModal
        key={`${selectedDepartmentForEdit?.id ?? "add"}-${isModalOpen}`}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateDepartment}
        onUpdate={handleUpdateDepartment}
        department={selectedDepartmentForEdit}
      />

      <DeleteDepartmentModal
        open={isDeleteModalOpen}
        departmentName={
          selectedDepartmentForDelete
            ? locale === "ar"
              ? selectedDepartmentForDelete.nameAR
              : selectedDepartmentForDelete.nameEN
            : ""
        }
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteDepartment}
      />

      
      {departments.length > 0 && (
        <TablePagination
          currentPage={safeCurrentPage}
          pageSize={pageSize}
          total={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </>
  );
};

export default DepartmentTable;