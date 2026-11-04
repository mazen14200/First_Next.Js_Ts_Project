"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import type {
  SkillLevel,
  CreateSkillLevelRequest,
  UpdateSkillLevelRequest,
} from "../types/skill-levels.types";

import SkillLevelModal from "./SkillLevelsModal";
import DeleteSkillLevelModal from "./DeleteSkillLevelsModal";

import TableHeader from "../../../components/ui/TableHeader/TableHeader";
import FilterSelect from "../../../components/ui/FilterSelect/FilterSelect";
import TablePagination from "../../../components/ui/TablePagination/TablePagination";

const SkillLevelsTable = () => {
  const locale = useLocale();
  const t = useTranslations("skillLevels");

  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>([]);
  const [loading, setLoading] = useState(true);

  const [pendingRankFilter, setPendingRankFilter] =
    useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    rank: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedSkillLevel, setSelectedSkillLevel] =
    useState<SkillLevel | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [
    selectedSkillLevelForDelete,
    setSelectedSkillLevelForDelete,
  ] = useState<SkillLevel | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSkillLevels = async () => {
    const response = await fetch("/api/skill-levels");

    if (!response.ok) {
      throw new Error("Failed to fetch skill levels");
    }

    const data: SkillLevel[] = await response.json();

    setSkillLevels(data);

    return data;
  };

  useEffect(() => {
    const loadSkillLevels = async () => {
      try {
        setLoading(true);

        await fetchSkillLevels();
      } catch (error) {
        console.error(
          "Failed to fetch skill levels:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadSkillLevels();
  }, []);

  const rankOptions = useMemo(() => {
    const ranks = Array.from(
      new Set(
        skillLevels.map(
          (skillLevel) => skillLevel.rank
        )
      )
    ).sort((a, b) => a - b);

    return ranks.map((rank) => ({
      value: String(rank),
      label: String(rank),
    }));
  }, [skillLevels]);

  const handleApplyFilters = (search: string) => {
    setAppliedFilters({
      search: search.trim(),
      rank: pendingRankFilter,
    });
  };

  const handleResetFilters = () => {
    setPendingRankFilter("");

    setAppliedFilters({
      search: "",
      rank: "",
    });
  };

  const filteredSkillLevels = useMemo(() => {
    const search = appliedFilters.search
      .trim()
      .toLowerCase();

    return skillLevels.filter((skillLevel) => {
      const matchesSearch =
        !search ||
        skillLevel.nameAr
          .toLowerCase()
          .includes(search) ||
        skillLevel.nameEn
          .toLowerCase()
          .includes(search);

      const matchesRank =
        !appliedFilters.rank ||
        String(skillLevel.rank) ===
          appliedFilters.rank;

      return matchesSearch && matchesRank;
    });
  }, [skillLevels, appliedFilters]);

  const handleOpenAddModal = () => {
    setSelectedSkillLevel(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (
    skillLevel: SkillLevel
  ) => {
    setSelectedSkillLevel(skillLevel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSkillLevel(null);
  };

  const refreshSkillLevels = async () => {
    await fetchSkillLevels();
  };

  const handleCreate = async (
    data: CreateSkillLevelRequest
  ): Promise<void> => {
    const response = await fetch(
      "/api/skill-levels",
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
        "Failed to create skill level"
      );
    }

    try {
      setLoading(true);

      await refreshSkillLevels();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (
    id: number,
    data: UpdateSkillLevelRequest
  ): Promise<void> => {
    const response = await fetch(
      `/api/skill-levels/${id}`,
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
        "Failed to update skill level"
      );
    }

    try {
      setLoading(true);

      await refreshSkillLevels();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedSkillLevelForDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/skill-levels/${selectedSkillLevelForDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete skill level"
        );
      }

      await refreshSkillLevels();

      setIsDeleteModalOpen(false);
      setSelectedSkillLevelForDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete skill level:",
        error
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenDeleteModal = (
    skillLevel: SkillLevel
  ) => {
    setSelectedSkillLevelForDelete(skillLevel);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedSkillLevelForDelete(null);
  };

  const skillLevelsCount = filteredSkillLevels.length;

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
          recordCount={skillLevelsCount}
          currentPage={1}
          showSearch={true}
          showPagination={false}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          filters={
            <FilterSelect
              label={t("rank")}
              value={pendingRankFilter}
              onChange={(value) =>
                setPendingRankFilter(value ?? "")
              }
              options={[
                {
                  value: "",
                  label: t("allRanks"),
                },
                ...rankOptions,
              ]}
            />
          }
          onAdd={handleOpenAddModal}
        />

        <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-center">
              <thead>
                <tr className="bg-[#1470ad]">
                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("skillLevel")}
                  </th>

                  <th className="w-40 border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("rank")}
                  </th>

                  <th className="w-40 border-b border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSkillLevels.map(
                  (skillLevel) => {
                    const skillLevelName =
                      locale === "ar"
                        ? skillLevel.nameAr
                        : skillLevel.nameEn;

                    return (
                      <tr
                        key={skillLevel.id}
                        className="group border-b border-slate-200 transition-colors duration-200 odd:bg-white even:bg-slate-50 hover:bg-[#1470ad]/5"
                      >
                        <td className="border-e border-slate-200 px-6 py-5">
                          <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                            {skillLevelName}
                          </span>
                        </td>

                        <td className="border-e border-slate-200 px-6 py-5">
                          <span className="inline-flex rounded-md border border-[#1470ad]/20 bg-[#1470ad]/10 px-3 py-1 text-sm font-medium text-[#1470ad]">
                            {skillLevel.rank}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="mx-auto flex w-fit items-center overflow-hidden rounded-xl border border-[#cbd6de] bg-white shadow-[0_3px_10px_rgba(8,29,56,0.07)] transition-all duration-200 group-hover:border-[#aebfc9] group-hover:shadow-[0_5px_16px_rgba(8,29,56,0.10)]">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenEditModal(
                                  skillLevel
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
                                  skillLevel
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

            {filteredSkillLevels.length === 0 && (
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

        <TablePagination
          currentPage={1}
          pageSize={10}
          total={skillLevelsCount}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />
      </div>

      <SkillLevelModal
        key={`${selectedSkillLevel?.id ?? "add"}-${isModalOpen}`}
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        skillLevel={selectedSkillLevel}
      />

      <DeleteSkillLevelModal
        open={isDeleteModalOpen}
        skillLevelName={
          selectedSkillLevelForDelete
            ? locale === "ar"
              ? selectedSkillLevelForDelete.nameAr
              : selectedSkillLevelForDelete.nameEn
            : ""
        }
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default SkillLevelsTable;
