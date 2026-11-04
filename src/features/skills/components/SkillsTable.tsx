"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { useLocale, useTranslations } from "next-intl";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import type {
  Skill,
  PaginatedSkillsResponse,
  CreateSkillRequest,
  UpdateSkillRequest,
} from "../types/skills.types";

import SkillsModal from "./SkillsModal";
import DeleteSkillsModal from "./DeleteSkillsModal";

import TableHeader from "../../../components/ui/TableHeader/TableHeader";
import TablePagination from "../../../components/ui/TablePagination/TablePagination";
import FilterSelect from "../../../components/ui/FilterSelect/FilterSelect";

const SkillsTable = () => {
  const locale = useLocale();
  const t = useTranslations("skills");

  const [paginatedResponse, setPaginatedResponse] =
    useState<PaginatedSkillsResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [pendingStatusFilter, setPendingStatusFilter] =
    useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedSkill, setSelectedSkill] =
    useState<Skill | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [selectedSkillForDelete, setSelectedSkillForDelete] =
    useState<Skill | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [updatingStatusId, setUpdatingStatusId] =
    useState<number | null>(null);

  const fetchSkills = async (
    page: number,
    size: number,
    search: string,
    status: string
  ) => {
    const params = new URLSearchParams({
      PageNumber: String(page),
      PageSize: String(size),
    });

    if (search.trim()) {
      params.set("Search", search.trim());
    }

    if (status === "active") {
      params.set("IsActive", "true");
    }

    if (status === "inactive") {
      params.set("IsActive", "false");
    }

    const response = await fetch(
      `/api/skills?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch skills");
    }

    const data: PaginatedSkillsResponse =
      await response.json();

    setPaginatedResponse(data);

    return data;
  };

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true);

        await fetchSkills(
          1,
          pageSize,
          appliedFilters.search,
          appliedFilters.status
        );
      } catch (error) {
        console.error(
          "Failed to fetch skills:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      setCurrentPage(page);

      await fetchSkills(
        page,
        pageSize,
        appliedFilters.search,
        appliedFilters.status
      );
    } catch (error) {
      console.error(
        "Failed to change skills page:",
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

      await fetchSkills(
        1,
        size,
        appliedFilters.search,
        appliedFilters.status
      );
    } catch (error) {
      console.error(
        "Failed to change skills page size:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (
    search: string
  ) => {
    const trimmedSearch = search.trim();

    try {
      setLoading(true);

      setAppliedFilters({
        search: trimmedSearch,
        status: pendingStatusFilter,
      });

      setCurrentPage(1);

      await fetchSkills(
        1,
        pageSize,
        trimmedSearch,
        pendingStatusFilter
      );
    } catch (error) {
      console.error(
        "Failed to apply skill filters:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    try {
      setLoading(true);

      setPendingStatusFilter("");

      setAppliedFilters({
        search: "",
        status: "",
      });

      setCurrentPage(1);

      await fetchSkills(
        1,
        pageSize,
        "",
        ""
      );
    } catch (error) {
      console.error(
        "Failed to reset skill filters:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshCurrentPage = async () => {
    await fetchSkills(
      currentPage,
      pageSize,
      appliedFilters.search,
      appliedFilters.status
    );
  };

  const handleCreate = async (
    data: CreateSkillRequest
  ): Promise<void> => {
    const response = await fetch("/api/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create skill");
    }

    try {
      setLoading(true);

      await refreshCurrentPage();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    id: number,
    data: UpdateSkillRequest
  ): Promise<void> => {
    const response = await fetch(
      `/api/skills/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update skill");
    }

    try {
      setLoading(true);

      await refreshCurrentPage();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedSkillForDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/skills/${selectedSkillForDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete skill");
      }

      await refreshCurrentPage();

      setIsDeleteModalOpen(false);
      setSelectedSkillForDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete skill:",
        error
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = (skill: Skill) => {
    const isDeactivating = skill.isActive;

    Modal.confirm({
      title: isDeactivating
        ? t("deactivateSkill")
        : t("activateSkill"),

      content: isDeactivating
        ? t("deactivateConfirmation")
        : t("activateConfirmation"),

      okText: isDeactivating
        ? t("deactivate")
        : t("activate"),

      cancelText: t("cancel"),

      okButtonProps: {
        danger: isDeactivating,
      },

      onOk: async () => {
        setUpdatingStatusId(skill.id);

        try {
          const action = isDeactivating
            ? "deactivate"
            : "activate";

          const response = await fetch(
            `/api/skills/${skill.id}/${action}`,
            {
              method: "PATCH",
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to ${action} skill`
            );
          }

          await refreshCurrentPage();
        } catch (error) {
          console.error(
            "Failed to update skill status:",
            error
          );

          throw error;
        } finally {
          setUpdatingStatusId(null);
        }
      },
    });
  };

  const handleOpenAddModal = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (
    skill: Skill
  ) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  const handleOpenDeleteModal = (
    skill: Skill
  ) => {
    setSelectedSkillForDelete(skill);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedSkillForDelete(null);
  };

  const skills = paginatedResponse?.items ?? [];

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
          filters={
            <FilterSelect
              label={t("status")}
              value={pendingStatusFilter}
              onChange={(value) =>
                setPendingStatusFilter(value ?? "")
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
          }
          onAdd={handleOpenAddModal}
        />

        <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-center">
              <thead>
                <tr className="bg-[#1470ad]">
                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("skill")}
                  </th>

                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("descriptionLabel")}
                  </th>

                  <th className="w-40 border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("status")}
                  </th>

                  <th className="w-40 border-b border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {skills.map((skill) => {
                  const skillName =
                    locale === "ar"
                      ? skill.nameAr
                      : skill.nameEn;

                  const isUpdatingStatus =
                    updatingStatusId === skill.id;

                  return (
                    <tr
                      key={skill.id}
                      className="group border-b border-slate-200 transition-colors duration-200 odd:bg-white even:bg-slate-50 hover:bg-[#1470ad]/5"
                    >
                      <td className="border-e border-slate-200 px-6 py-5">
                        <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                          {skillName}
                        </span>
                      </td>

                      <td className="border-e border-slate-200 px-6 py-5">
                        <span className="inline-flex max-w-[420px] rounded-lg px-2.5 py-1.5 text-sm text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                          <span
                            className="truncate"
                            title={skill.description ?? ""}
                          >
                            {skill.description || "—"}
                          </span>
                        </span>
                      </td>

                      <td className="border-e border-slate-200 px-6 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(skill)
                          }
                          disabled={isUpdatingStatus}
                          className={`relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full p-1 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                            skill.isActive
                              ? "bg-emerald-500 hover:bg-emerald-600 hover:ring-4 hover:ring-emerald-100"
                              : "bg-slate-200 hover:bg-slate-300 hover:ring-4 hover:ring-slate-100"
                          }`}
                          title={
                            skill.isActive
                              ? t("deactivate")
                              : t("activate")
                          }
                        >
                          <span
                            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                              skill.isActive
                                ? "start-1"
                                : "end-1"
                            }`}
                          />
                        </button>
                      </td>

                      <td className="px-6 py-5">
                        <div className="mx-auto flex w-fit items-center overflow-hidden rounded-xl border border-[#cbd6de] bg-white shadow-[0_3px_10px_rgba(8,29,56,0.07)] transition-all duration-200 group-hover:border-[#aebfc9] group-hover:shadow-[0_5px_16px_rgba(8,29,56,0.10)]">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEditModal(skill)
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
                              handleOpenDeleteModal(skill)
                            }
                            className="flex h-9 w-10 cursor-pointer items-center justify-center bg-[#fff0f0] text-[#ff0000] transition-all duration-200 hover:bg-[#ff0000] hover:text-white"
                            title={t("delete")}
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {skills.length === 0 && (
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

      <SkillsModal
        key={`${selectedSkill?.id ?? "add"}-${isModalOpen}`}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        skill={selectedSkill}
      />

      <DeleteSkillsModal
        open={isDeleteModalOpen}
        skillName={
          selectedSkillForDelete
            ? locale === "ar"
              ? selectedSkillForDelete.nameAr
              : selectedSkillForDelete.nameEn
            : ""
        }
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
      />

      
      {skills.length > 0 && (
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

export default SkillsTable;