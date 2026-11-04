"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import type { Team } from "../types/team.types";

import TeamModal from "./TeamModal";
import DeleteTeamModal from "./DeleteTeamModal";

import TableHeader from "../../../components/ui/TableHeader/TableHeader";
import TablePagination from "../../../components/ui/TablePagination/TablePagination";

const TeamTable = () => {
  const locale = useLocale();
  const t = useTranslations("teams");

  const [teams, setTeams] = useState<Team[]>([]);
  const [totalCount, setTotalCount] = useState(0);

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
  const [selectedTeamForEdit, setSelectedTeamForEdit] =
    useState<Team | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeamForDelete, setSelectedTeamForDelete] =
    useState<Team | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTeams = async (
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

    const response = await fetch(
      `/api/teams?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch teams");
    }

    const data = await response.json();

    setTeams(data.items ?? []);
    setTotalCount(data.totalCount ?? 0);

    return data;
  };

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);

        await fetchTeams(
          1,
          pageSize,
          appliedSearch
        );
      } catch (error) {
        console.error(
          "Failed to fetch teams:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      setCurrentPage(page);

      await fetchTeams(
        page,
        pageSize,
        appliedSearch
      );
    } catch (error) {
      console.error(
        "Failed to fetch teams:",
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

      await fetchTeams(
        1,
        size,
        appliedSearch
      );
    } catch (error) {
      console.error(
        "Failed to change team page size:",
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

      await fetchTeams(
        1,
        pageSize,
        trimmedSearch
      );
    } catch (error) {
      console.error(
        "Failed to apply team search:",
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

      await fetchTeams(
        1,
        pageSize,
        ""
      );
    } catch (error) {
      console.error(
        "Failed to reset team search:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (
    data: {
      nameAR: string;
      nameEN: string;
      rate: number;
    }
  ): Promise<void> => {
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create team");
    }

    try {
      setLoading(true);

      await fetchTeams(
        currentPage,
        pageSize,
        appliedSearch
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async (
    id: number,
    data: {
      nameAR: string;
      nameEN: string;
      rate: number;
    }
  ): Promise<void> => {
    const response = await fetch(
      `/api/teams/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update team");
    }

    try {
      setLoading(true);

      await fetchTeams(
        currentPage,
        pageSize,
        appliedSearch
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedTeamForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (team: Team) => {
    setSelectedTeamForEdit(team);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeamForEdit(null);
  };

  const handleOpenDeleteModal = (team: Team) => {
    setSelectedTeamForDelete(team);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedTeamForDelete(null);
  };

  const handleDeleteTeam = async (): Promise<void> => {
    if (!selectedTeamForDelete) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(
        `/api/teams/${selectedTeamForDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete team");
      }

      await fetchTeams(
        currentPage,
        pageSize,
        appliedSearch
      );

      setIsDeleteModalOpen(false);
      setSelectedTeamForDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete team:",
        error
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getTeamName = (team: Team) => {
    return locale === "ar"
      ? team.nameAR
      : team.nameEN;
  };

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
          currentPage={currentPage}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          onPageSizeChange={handlePageSizeChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onAdd={handleOpenAddModal}
        />

        <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-center">
              <thead>
                <tr className="bg-[#1470ad]">
                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("name")}
                  </th>

                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("rate")}
                  </th>

                  <th className="w-56 border-b border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {teams.map((team) => {
                  const teamName = getTeamName(team);

                  return (
                    <tr
                      key={team.id}
                      className="group border-b border-slate-200 transition-colors duration-200 odd:bg-white even:bg-slate-50 hover:bg-[#1470ad]/5"
                    >
                      <td className="border-e border-slate-200 px-6 py-5">
                        <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                          {teamName}
                        </span>
                      </td>

                      <td className="border-e border-slate-200 px-6 py-5">
                        <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                          {team.rate}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="mx-auto flex w-fit items-center overflow-hidden rounded-xl border border-[#cbd6de] bg-white shadow-[0_3px_10px_rgba(8,29,56,0.07)] transition-all duration-200 group-hover:border-[#aebfc9] group-hover:shadow-[0_5px_16px_rgba(8,29,56,0.10)]">
                          <button
                            type="button"
                            aria-label={`${t("edit")} ${teamName}`}
                            title={t("edit")}
                            onClick={() =>
                              handleOpenEditModal(team)
                            }
                            className="flex h-9 w-10 cursor-pointer items-center justify-center bg-[#eaf3f8] text-[#1470ad] transition-all duration-200 hover:bg-[#0f5f91] hover:text-white"
                          >
                            <EditOutlined className="text-[15px]" />
                          </button>

                          <span className="h-5 w-px bg-[#cbd6de]" />

                          <button
                            type="button"
                            aria-label={`${t("delete")} ${teamName}`}
                            title={t("delete")}
                            onClick={() =>
                              handleOpenDeleteModal(team)
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

            {teams.length === 0 && (
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

      {isModalOpen && (
        <TeamModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateTeam}
          onUpdate={handleUpdateTeam}
          team={selectedTeamForEdit}
        />
      )}

      {isDeleteModalOpen && selectedTeamForDelete && (
        <DeleteTeamModal
          team={selectedTeamForDelete}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteTeam}
        />
      )}

      
      {teams.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </>
  );
};

export default TeamTable;
