"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

import TableHeader from "../../../components/ui/TableHeader/TableHeader";
import FilterSelect from "../../../components/ui/FilterSelect/FilterSelect";
import TablePagination from "../../../components/ui/TablePagination/TablePagination";

import type {
  CreateStatusRequest,
  Status,
  UpdateStatusRequest,
} from "../index";

import StatusModal from "./StatusModal";
import DeleteStatusModal from "./DeleteStatusModal";

const StatusTable = () => {
  const t = useTranslations("status");

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);

  const [pendingColorFilter, setPendingColorFilter] =
    useState("");

  const [pendingStatusFilter, setPendingStatusFilter] =
    useState("");

  const [appliedFilters, setAppliedFilters] =
    useState({
      search: "",
      color: "",
      status: "",
    });

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState<Status | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [
    selectedStatusForDelete,
    setSelectedStatusForDelete,
  ] = useState<Status | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const fetchStatuses = async () => {
    const response = await fetch("/api/status");

    if (!response.ok) {
      throw new Error("Failed to fetch statuses");
    }

    const data: Status[] = await response.json();

    setStatuses(
      data.filter((status) => status.name.trim())
    );

    return data;
  };

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        setLoading(true);

        await fetchStatuses();
      } catch (error) {
        console.error(
          "Failed to fetch statuses:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadStatuses();
  }, []);

  const colorOptions = useMemo(() => {
    const colors = Array.from(
      new Set(
        statuses
          .map((status) => status.colorCode)
          .filter(Boolean)
      )
    );

    return [
      {
        value: "",
        label: t("allColors"),
      },
      ...colors.map((color) => ({
        value: color,
        label: color,
      })),
    ];
  }, [statuses, t]);

  const handleApplyFilters = (
    search: string
  ) => {
    setAppliedFilters({
      search: search.trim(),
      color: pendingColorFilter,
      status: pendingStatusFilter,
    });
  };

  const handleResetFilters = () => {
    setPendingColorFilter("");
    setPendingStatusFilter("");

    setAppliedFilters({
      search: "",
      color: "",
      status: "",
    });
  };

  const filteredStatuses = useMemo(() => {
    const search =
      appliedFilters.search
        .trim()
        .toLowerCase();

    return statuses.filter((status) => {
      const matchesSearch =
        !search ||
        status.name
          .toLowerCase()
          .includes(search) ||
        status.description
          ?.toLowerCase()
          .includes(search);

      const matchesColor =
        !appliedFilters.color ||
        status.colorCode ===
          appliedFilters.color;

      const matchesStatus =
        !appliedFilters.status ||
        (appliedFilters.status === "active"
          ? status.isActive
          : !status.isActive);

      return (
        matchesSearch &&
        matchesColor &&
        matchesStatus
      );
    });
  }, [statuses, appliedFilters]);

  const handleOpenAddModal = () => {
    setSelectedStatus(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (
    status: Status
  ) => {
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStatus(null);
  };

  const refreshStatuses = async () => {
    await fetchStatuses();
  };

  const handleCreate = async (
    data: CreateStatusRequest
  ): Promise<void> => {
    const response = await fetch(
      "/api/status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to create status"
      );
    }

    try {
      setLoading(true);

      await refreshStatuses();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    id: number,
    data: UpdateStatusRequest
  ): Promise<void> => {
    const response = await fetch(
      `/api/status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to update status"
      );
    }

    try {
      setLoading(true);

      await refreshStatuses();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedStatusForDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/status/${selectedStatusForDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete status"
        );
      }

      await refreshStatuses();

      setIsDeleteModalOpen(false);
      setSelectedStatusForDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete status:",
        error
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenDeleteModal = (
    status: Status
  ) => {
    setSelectedStatusForDelete(status);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedStatusForDelete(null);
  };

  const statusesCount =
    filteredStatuses.length;

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
          recordCount={statusesCount}
          currentPage={1}
          showSearch={true}
          showPagination={false}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          filters={
            <>
              <FilterSelect
                label={t("colorCode")}
                value={pendingColorFilter}
                onChange={(value) =>
                  setPendingColorFilter(
                    value ?? ""
                  )
                }
                options={colorOptions}
              />

              <FilterSelect
                label={t("status")}
                value={pendingStatusFilter}
                onChange={(value) =>
                  setPendingStatusFilter(
                    value ?? ""
                  )
                }
                options={[
                  {
                    value: "",
                    label: t("allStatuses"),
                  },
                  {
                    value: "active",
                    label: t("active"),
                  },
                  {
                    value: "inactive",
                    label: t("inactive"),
                  },
                ]}
              />
            </>
          }
          onAdd={handleOpenAddModal}
        />

        <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-center">
              <thead>
                <tr className="bg-[#1470ad]">
                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("name")}
                  </th>

                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("descriptionLabel")}
                  </th>

                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("colorCode")}
                  </th>

                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("displayOrder")}
                  </th>

                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("status")}
                  </th>

                  <th className="w-40 border-b border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStatuses.map((status) => (
                  <tr
                    key={status.id}
                    className="group border-b border-slate-200 transition-colors duration-200 odd:bg-white even:bg-slate-50 hover:bg-[#1470ad]/5"
                  >
                    <td className="border-e border-slate-200 px-6 py-5">
                      <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                        {status.name}
                      </span>
                    </td>

                    <td className="border-e border-slate-200 px-6 py-5">
                      <span
                        className="inline-flex max-w-[420px] rounded-lg px-2.5 py-1.5 text-sm text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white"
                        title={
                          status.description ?? ""
                        }
                      >
                        <span className="truncate">
                          {status.description ||
                            "—"}
                        </span>
                      </span>
                    </td>

                    <td className="border-e border-slate-200 px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className="h-5 w-5 rounded-full border border-slate-200 shadow-sm"
                          style={{
                            backgroundColor:
                              status.colorCode ||
                              "#e2e8f0",
                          }}
                        />

                        <span className="text-sm font-medium text-slate-600">
                          {status.colorCode ||
                            "—"}
                        </span>
                      </div>
                    </td>

                    <td className="border-e border-slate-200 px-6 py-5">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-md border border-[#1470ad]/20 bg-[#1470ad]/10 px-2.5 py-1.5 text-sm font-semibold text-[#1470ad]">
                        {status.displayOrder ??
                          "—"}
                      </span>
                    </td>

                    <td className="border-e border-slate-200 px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          status.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {status.isActive
                          ? t("active")
                          : t("inactive")}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="mx-auto flex w-fit items-center overflow-hidden rounded-xl border border-[#cbd6de] bg-white shadow-[0_3px_10px_rgba(8,29,56,0.07)] transition-all duration-200 group-hover:border-[#aebfc9] group-hover:shadow-[0_5px_16px_rgba(8,29,56,0.10)]">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenEditModal(
                              status
                            )
                          }
                          className="flex h-9 w-10 cursor-pointer items-center justify-center bg-[#eaf3f8] text-[#1470ad] transition-all duration-200 hover:bg-[#0f5f91] hover:text-white"
                          title={t("edit")}
                        >
                          <EditOutlined />
                        </button>

                        <span className="h-5 w-px bg-[#cbd6de]" />

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenDeleteModal(
                              status
                            )
                          }
                          className="flex h-9 w-10 cursor-pointer items-center justify-center bg-[#fff0f0] text-[#ff0000] transition-all duration-200 hover:bg-[#ff0000] hover:text-white"
                          title={t("delete")}
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStatuses.length === 0 && (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <span className="text-lg">
                    —
                  </span>
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

        <TablePagination
          currentPage={1}
          pageSize={10}
          total={statusesCount}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />
      </div>

      <StatusModal
        key={`${selectedStatus?.id ?? "add"}-${isModalOpen}`}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        status={selectedStatus}
      />

      <DeleteStatusModal
        open={isDeleteModalOpen}
        statusName={
          selectedStatusForDelete?.name ?? ""
        }
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default StatusTable;
