"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import type {
  EmployeeSkill,
  PaginatedEmployeeSkillsResponse,
  CreateEmployeeSkillRequest,
  UpdateEmployeeSkillRequest,
} from "../types/employee-skills.types";

import EmployeeSkillsModal from "./EmployeeSkillsModal";
import DeleteEmployeeSkillModal from "./DeleteEmployeeSkillModal";

import TableHeader from "../../../../components/ui/TableHeader/TableHeader";
import TablePagination from "../../../../components/ui/TablePagination/TablePagination";
import FilterSelect from "../../../../components/ui/FilterSelect/FilterSelect";

interface EmployeeSkillsTableProps {
  employeeId: string;
}

interface SkillOption {
  id: number;
  nameAr: string;
  nameEn: string;
}

interface SkillLevelOption {
  id: number;
  nameAr: string;
  nameEn: string;
  rank: number;
}

const EmployeeSkillsTable = ({
  employeeId,
}: EmployeeSkillsTableProps) => {
  const locale = useLocale();
  const t = useTranslations("employeeSkills");

  const [paginatedResponse, setPaginatedResponse] =
    useState<PaginatedEmployeeSkillsResponse | null>(
      null
    );

  const [loading, setLoading] = useState(true);

  const [skills, setSkills] = useState<SkillOption[]>(
    []
  );

  const [skillLevels, setSkillLevels] = useState<
    SkillLevelOption[]
  >([]);

  const [pendingSkillFilter, setPendingSkillFilter] =
    useState("");

  const [
    pendingSkillLevelFilter,
    setPendingSkillLevelFilter,
  ] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    skillId: "",
    skillLevelId: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [
    selectedEmployeeSkill,
    setSelectedEmployeeSkill,
  ] = useState<EmployeeSkill | null>(null);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [
    selectedEmployeeSkillForDelete,
    setSelectedEmployeeSkillForDelete,
  ] = useState<EmployeeSkill | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployeeSkills = async (
    page: number,
    size: number,
    search: string,
    skillId: string,
    skillLevelId: string
  ) => {
    const params = new URLSearchParams({
      PageNumber: String(page),
      PageSize: String(size),
    });

    if (search.trim()) {
      params.set("Search", search.trim());
    }

    if (skillId) {
      params.set("SkillId", skillId);
    }

    if (skillLevelId) {
      params.set("SkillLevelId", skillLevelId);
    }

    const response = await fetch(
      `/api/employees/${employeeId}/skills?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch employee skills"
      );
    }

    const data: PaginatedEmployeeSkillsResponse =
      await response.json();

    setPaginatedResponse(data);

    return data;
  };

  const fetchSkills = async () => {
    const response = await fetch(
      "/api/skills?PageNumber=1&PageSize=100"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch skills");
    }

    const data: {
      items: SkillOption[];
    } = await response.json();

    setSkills(data.items ?? []);
  };

  const fetchSkillLevels = async () => {
    const response = await fetch(
      "/api/skill-levels"
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch skill levels"
      );
    }

    const data: SkillLevelOption[] =
      await response.json();

    setSkillLevels(data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchEmployeeSkills(
            1,
            pageSize,
            appliedFilters.search,
            appliedFilters.skillId,
            appliedFilters.skillLevelId
          ),
          fetchSkills(),
          fetchSkillLevels(),
        ]);
      } catch (error) {
        console.error(
          "Failed to fetch employee skills data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [employeeId]);

  const handlePageChange = async (
    page: number
  ) => {
    try {
      setLoading(true);
      setCurrentPage(page);

      await fetchEmployeeSkills(
        page,
        pageSize,
        appliedFilters.search,
        appliedFilters.skillId,
        appliedFilters.skillLevelId
      );
    } catch (error) {
      console.error(
        "Failed to change employee skills page:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageSizeChange = async (
    size: number
  ) => {
    try {
      setLoading(true);

      setPageSize(size);
      setCurrentPage(1);

      await fetchEmployeeSkills(
        1,
        size,
        appliedFilters.search,
        appliedFilters.skillId,
        appliedFilters.skillLevelId
      );
    } catch (error) {
      console.error(
        "Failed to change employee skills page size:",
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
        skillId: pendingSkillFilter,
        skillLevelId:
          pendingSkillLevelFilter,
      });

      setCurrentPage(1);

      await fetchEmployeeSkills(
        1,
        pageSize,
        trimmedSearch,
        pendingSkillFilter,
        pendingSkillLevelFilter
      );
    } catch (error) {
      console.error(
        "Failed to apply employee skill filters:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    try {
      setLoading(true);

      setPendingSkillFilter("");
      setPendingSkillLevelFilter("");

      setAppliedFilters({
        search: "",
        skillId: "",
        skillLevelId: "",
      });

      setCurrentPage(1);

      await fetchEmployeeSkills(
        1,
        pageSize,
        "",
        "",
        ""
      );
    } catch (error) {
      console.error(
        "Failed to reset employee skill filters:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshCurrentPage = async () => {
    await fetchEmployeeSkills(
      currentPage,
      pageSize,
      appliedFilters.search,
      appliedFilters.skillId,
      appliedFilters.skillLevelId
    );
  };

  const handleCreate = async (
    data: CreateEmployeeSkillRequest
  ): Promise<void> => {
    const response = await fetch(
      `/api/employees/${employeeId}/skills`,
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
        "Failed to create employee skill"
      );
    }

    try {
      setLoading(true);

      await refreshCurrentPage();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    skillId: number,
    data: UpdateEmployeeSkillRequest
  ): Promise<void> => {
    const response = await fetch(
      `/api/employees/${employeeId}/skills/${skillId}`,
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
        "Failed to update employee skill"
      );
    }

    try {
      setLoading(true);

      await refreshCurrentPage();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedEmployeeSkillForDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/employees/${employeeId}/skills/${selectedEmployeeSkillForDelete.skillId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete employee skill"
        );
      }

      await refreshCurrentPage();

      setIsDeleteModalOpen(false);
      setSelectedEmployeeSkillForDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete employee skill:",
        error
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedEmployeeSkill(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (
    employeeSkill: EmployeeSkill
  ) => {
    setSelectedEmployeeSkill(employeeSkill);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployeeSkill(null);
  };

  const handleOpenDeleteModal = (
    employeeSkill: EmployeeSkill
  ) => {
    setSelectedEmployeeSkillForDelete(
      employeeSkill
    );
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedEmployeeSkillForDelete(null);
  };

  const employeeSkills: EmployeeSkill[] =
    paginatedResponse?.items ?? [];

  const totalCount =
    paginatedResponse?.totalCount ?? 0;

  const safeCurrentPage =
    paginatedResponse?.pageNumber ??
    currentPage;

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
            <div className="flex w-full items-center gap-3">
              <div className="flex-1">
                <FilterSelect
                  label={t("skill")}
                  value={pendingSkillFilter}
                  onChange={(value) =>
                    setPendingSkillFilter(
                      value ?? ""
                    )
                  }
                  options={[
                    {
                      value: "",
                      label: t("allSkills"),
                    },
                    ...skills.map((skill) => ({
                      value: String(skill.id),
                      label:
                        locale === "ar"
                          ? skill.nameAr
                          : skill.nameEn,
                    })),
                  ]}
                />
              </div>

              <div className="flex-1">
                <FilterSelect
                  label={t("skillLevel")}
                  value={
                    pendingSkillLevelFilter
                  }
                  onChange={(value) =>
                    setPendingSkillLevelFilter(
                      value ?? ""
                    )
                  }
                  options={[
                    {
                      value: "",
                      label: t(
                        "allSkillLevels"
                      ),
                    },
                    ...skillLevels.map(
                      (level) => ({
                        value: String(
                          level.id
                        ),
                        label:
                          locale === "ar"
                            ? level.nameAr
                            : level.nameEn,
                      })
                    ),
                  ]}
                />
              </div>
            </div>
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
                    {t("skillLevel")}
                  </th>

                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("rank")}
                  </th>

                  <th className="w-40 border-b border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {employeeSkills.map(
                  (employeeSkill) => {
                    const skillName =
                      locale === "ar"
                        ? employeeSkill.skillNameAr
                        : employeeSkill.skillNameEn;

                    const skillLevelName =
                      locale === "ar"
                        ? employeeSkill.skillLevelNameAr
                        : employeeSkill.skillLevelNameEn;

                    return (
                      <tr
                        key={employeeSkill.id}
                        className="group border-b border-slate-200 transition-colors duration-200 odd:bg-white even:bg-slate-50 hover:bg-[#1470ad]/5"
                      >
                        <td className="border-e border-slate-200 px-6 py-5">
                          <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                            {skillName}
                          </span>
                        </td>

                        <td className="border-e border-slate-200 px-6 py-5">
                          <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                            {skillLevelName}
                          </span>
                        </td>

                        <td className="border-e border-slate-200 px-6 py-5">
                          <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                            {
                              employeeSkill.skillLevelRank
                            }
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="mx-auto flex w-fit items-center overflow-hidden rounded-xl border border-[#cbd6de] bg-white shadow-[0_3px_10px_rgba(8,29,56,0.07)] transition-all duration-200 group-hover:border-[#aebfc9] group-hover:shadow-[0_5px_16px_rgba(8,29,56,0.10)]">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenEditModal(
                                  employeeSkill
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
                                  employeeSkill
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
                    );
                  }
                )}
              </tbody>
            </table>

            {employeeSkills.length === 0 && (
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

          {employeeSkills.length > 0 && (
            <TablePagination
              currentPage={safeCurrentPage}
              pageSize={pageSize}
              total={totalCount}
              onPageChange={
                handlePageChange
              }
              onPageSizeChange={
                handlePageSizeChange
              }
            />
          )}
        </section>
      </div>

      <EmployeeSkillsModal
        key={`${selectedEmployeeSkill?.id ?? "add"}-${isModalOpen}`}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        employeeSkill={
          selectedEmployeeSkill
        }
        skills={skills}
        skillLevels={skillLevels}
      />

      <DeleteEmployeeSkillModal
        open={isDeleteModalOpen}
        skillName={
          selectedEmployeeSkillForDelete
            ? locale === "ar"
              ? selectedEmployeeSkillForDelete.skillNameAr
              : selectedEmployeeSkillForDelete.skillNameEn
            : ""
        }
        isDeleting={isDeleting}
        onClose={
          handleCloseDeleteModal
        }
        onConfirm={handleDelete}
      />
    </>
  );
};

export default EmployeeSkillsTable;