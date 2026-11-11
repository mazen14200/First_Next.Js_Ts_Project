"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types/role.types";

import RoleModal from "./RoleModal";
import DeleteRoleModal from "./DeleteRoleModal";

import TableHeader from "../../../components/ui/TableHeader/TableHeader";
import TablePagination from "../../../components/ui/TablePagination/TablePagination";
import FilterSelect from "../../../components/ui/FilterSelect/FilterSelect";

const RoleTable = () => {
  const locale = useLocale();
  const t = useTranslations("roles");

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading] = useState(false);

  /*
   * Pending filters
   *
   * These values represent the current selections
   * made by the user before clicking Submit.
   */
  const [pendingRoleFilter, setPendingRoleFilter] =
    useState("");

  /*
   * Applied filters
   *
   * These are the values actually used to filter
   * the table data.
   */
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    role: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoleForEdit, setSelectedRoleForEdit] =
    useState<Role | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoleForDelete, setSelectedRoleForDelete] =
    useState<Role | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  /*
   * Create role
   */
  const handleCreateRole = async (
    data: CreateRoleRequest
  ): Promise<void> => {
    const newRole: Role = {
      id: Date.now(),
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      description: data.description,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    setRoles((currentRoles) => [
      ...currentRoles,
      newRole,
    ]);
  };

  /*
   * Update role
   */
  const handleUpdateRole = async (
    id: number,
    data: UpdateRoleRequest
  ): Promise<void> => {
    setRoles((currentRoles) =>
      currentRoles.map((role) =>
        role.id === id
          ? {
              ...role,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : role
      )
    );
  };

  /*
   * Open Add Modal
   */
  const handleOpenAddModal = () => {
    setSelectedRoleForEdit(null);
    setIsModalOpen(true);
  };

  /*
   * Open Edit Modal
   */
  const handleOpenEditModal = (role: Role) => {
    setSelectedRoleForEdit(role);
    setIsModalOpen(true);
  };

  /*
   * Close Add / Edit Modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoleForEdit(null);
  };

  /*
   * Open Delete Modal
   */
  const handleOpenDeleteModal = (role: Role) => {
    setSelectedRoleForDelete(role);
    setIsDeleteModalOpen(true);
  };

  /*
   * Close Delete Modal
   */
  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedRoleForDelete(null);
  };

  /*
   * Delete role
   */
  const handleDeleteRole = async (): Promise<void> => {
    if (!selectedRoleForDelete) {
      return;
    }

    try {
      setIsDeleting(true);

      setRoles((currentRoles) =>
        currentRoles.filter(
          (role) =>
            role.id !== selectedRoleForDelete.id
        )
      );

      setIsDeleteModalOpen(false);
      setSelectedRoleForDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete role:",
        error
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /*
   * Apply all filters
   *
   * Search + Role are applied together
   * only when the user clicks Submit.
   */
  const handleApplyFilters = (search: string) => {
    setAppliedFilters({
      search: search.trim(),
      role: pendingRoleFilter,
    });

    setCurrentPage(1);
  };

  /*
   * Reset all filters
   *
   * Clear both pending and applied values.
   */
  const handleResetFilters = () => {
    setPendingRoleFilter("");

    setAppliedFilters({
      search: "",
      role: "",
    });

    setCurrentPage(1);
  };


  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const normalizedSearch =
        appliedFilters.search.toLowerCase().trim();

      const roleName =
        locale === "ar"
          ? role.nameAr
          : role.nameEn;

      const matchesSearch =
        !normalizedSearch ||
        roleName
          .toLowerCase()
          .trim()
          .includes(normalizedSearch);

      const matchesRole =
        !appliedFilters.role ||
        String(role.id) ===
          appliedFilters.role;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [roles, appliedFilters, locale]);

  /*
   * Pagination
   */
  const totalPages = Math.ceil(
    filteredRoles.length / pageSize
  );

  const safeCurrentPage =
    totalPages > 0
      ? Math.min(currentPage, totalPages)
      : 1;

  const paginatedRoles =
    filteredRoles.slice(
      (safeCurrentPage - 1) * pageSize,
      safeCurrentPage * pageSize
    );

  /*
   * Loading state
   */
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
        {/* Table Header */}
        <TableHeader
          title={t("title")}
          description={t("description")}
          recordCount={filteredRoles.length}
          currentPage={safeCurrentPage}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          filters={
            <FilterSelect
              label={t("role")}
              value={pendingRoleFilter}
              onChange={(value) =>
                setPendingRoleFilter(value ?? "")
              }
              options={[
                {
                  value: "",
                  label: t("allRoles"),
                },
                ...roles.map((role) => ({
                  value: String(role.id),
                  label:
                    locale === "ar"
                      ? role.nameAr
                      : role.nameEn,
                })),
              ]}
            />
          }
          onAdd={handleOpenAddModal}
        />

        {/* Table */}
        <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-start">
              <thead>
                <tr className="bg-[#1470ad]">
                  {/* Role */}
                  <th
                    className="
                      border-b
                      border-e
                      border-white/20
                      px-6
                      py-4
                      text-start
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-white
                    "
                  >
                    {t("role")}
                  </th>

                  {/* Description */}
                  <th
                    className="
                      border-b
                      border-e
                      border-white/20
                      px-6
                      py-4
                      text-start
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-white
                    "
                  >
                    {t("descriptionLabel")}
                  </th>

                  {/* Status */}
                  <th
                    className="
                      border-b
                      border-e
                      border-white/20
                      px-6
                      py-4
                      text-start
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-white
                    "
                  >
                    {t("status")}
                  </th>

                  {/* Actions */}
                  <th
                    className="
                      w-56
                      border-b
                      border-white/20
                      px-6
                      py-4
                      text-center
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-white
                    "
                  >
                    {t("actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedRoles.map((role) => {
                  const roleName =
                    locale === "ar"
                      ? role.nameAr
                      : role.nameEn;

                  return (
                    <tr
                      key={role.id}
                      className="
                        group
                        border-b
                        border-slate-200
                        transition-colors
                        duration-200
                        odd:bg-white
                        even:bg-slate-50
                        hover:bg-[#1470ad]/5
                      "
                    >
                      {/* Role */}
                      <td
                        className="
                          border-e
                          border-slate-200
                          px-6
                          py-5
                        "
                      >
                        <span
                          className="
                            inline-flex
                            rounded-lg
                            px-2.5
                            py-1.5
                            text-sm
                            font-semibold
                            text-slate-700
                            transition-all
                            duration-200
                            group-hover:bg-[#1470ad]
                            group-hover:text-white
                          "
                        >
                          {roleName}
                        </span>
                      </td>

                      {/* Description */}
                      <td
                        className="
                          border-e
                          border-slate-200
                          px-6
                          py-5
                        "
                      >
                        <span className="text-sm text-slate-600">
                          {role.description || "-"}
                        </span>
                      </td>

                      {/* Status */}
                      <td
                        className="
                          border-e
                          border-slate-200
                          px-6
                          py-5
                        "
                      >
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                            role.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {role.isActive
                            ? t("active")
                            : t("inactive")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div
                          className="
                            mx-auto
                            flex
                            w-fit
                            items-center
                            overflow-hidden
                            rounded-xl
                            border
                            border-[#cbd6de]
                            bg-white
                            shadow-[0_3px_10px_rgba(8,29,56,0.07)]
                            transition-all
                            duration-200
                            group-hover:border-[#aebfc9]
                            group-hover:shadow-[0_5px_16px_rgba(8,29,56,0.10)]
                          "
                        >
                          {/* Edit */}
                          <button
                            type="button"
                            aria-label={`${t("edit")} ${roleName}`}
                            title={t("edit")}
                            onClick={() =>
                              handleOpenEditModal(role)
                            }
                            className="
                              flex
                              h-9
                              w-10
                              cursor-pointer
                              items-center
                              justify-center
                              bg-[#eaf3f8]
                              text-[#1470ad]
                              transition-all
                              duration-200
                              hover:bg-[#0f5f91]
                              hover:text-white
                            "
                          >
                            <EditOutlined className="text-[15px]" />
                          </button>

                          {/* Divider */}
                          <span className="h-5 w-px bg-[#cbd6de]" />

                          {/* Delete */}
                          <button
                            type="button"
                            aria-label={`${t("delete")} ${roleName}`}
                            title={t("delete")}
                            onClick={() =>
                              handleOpenDeleteModal(role)
                            }
                            className="
                              flex
                              h-9
                              w-10
                              cursor-pointer
                              items-center
                              justify-center
                              bg-[#fff0f0]
                              text-[#ff0000]
                              transition-all
                              duration-200
                              hover:bg-[#ff0000]
                              hover:text-white
                            "
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

            {/* Empty State */}
            {filteredRoles.length === 0 && (
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

          {/* Pagination */}
          {filteredRoles.length > 0 && (
            <TablePagination
              currentPage={safeCurrentPage}
              pageSize={pageSize}
              total={filteredRoles.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          )}
        </section>
      </div>

      {/* Add / Edit Modal */}
      <RoleModal
        key={`${selectedRoleForEdit?.id ?? "add"}-${isModalOpen}`}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateRole}
        onUpdate={handleUpdateRole}
        role={selectedRoleForEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteRoleModal
        open={isDeleteModalOpen}
        roleName={
          selectedRoleForDelete
            ? locale === "ar"
              ? selectedRoleForDelete.nameAr
              : selectedRoleForDelete.nameEn
            : ""
        }
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteRole}
      />
    </>
  );
};

export default RoleTable;
