"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import type {
  TeamProject,
  TeamProjectOption,
} from "../types/team-project.types";

import TeamProjectModal from "./TeamProjectModal";
import DeleteTeamProjectModal from "./DeleteTeamProjectModal";

import TableHeader from "../../../components/ui/TableHeader/TableHeader";
import TablePagination from "../../../components/ui/TablePagination/TablePagination";
import FilterSelect from "../../../components/ui/FilterSelect/FilterSelect";

const TeamProjectTable = () => {
  const locale = useLocale();
  const t = useTranslations("teamProjects");

  const [teamProjects, setTeamProjects] = useState<
    TeamProject[]
  >([]);

  const [teams, setTeams] = useState<
    TeamProjectOption[]
  >([]);

  const [projects, setProjects] = useState<
    TeamProjectOption[]
  >([]);

  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [isLoadingDetails, setIsLoadingDetails] =
    useState(false);

  // Pending filters: values selected by the user
  // but not applied yet.
  const [pendingTeamId, setPendingTeamId] =
    useState<number | undefined>();

  const [pendingProjectId, setPendingProjectId] =
    useState<number | undefined>();

  // Applied filters: the values actually used
  // for the latest API request.
  const [appliedFilters, setAppliedFilters] =
    useState({
      search: "",
      teamId: undefined as number | undefined,
      projectId: undefined as number | undefined,
    });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [
    selectedTeamProjectForEdit,
    setSelectedTeamProjectForEdit,
  ] = useState<TeamProject | null>(null);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [
    selectedTeamProjectForDelete,
    setSelectedTeamProjectForDelete,
  ] = useState<TeamProject | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const fetchTeamProjects = async (
    page: number,
    size: number,
    search: string,
    teamId?: number,
    projectId?: number
  ) => {
    const params = new URLSearchParams({
      PageNumber: String(page),
      PageSize: String(size),
    });

    if (teamId !== undefined) {
      params.set("TeamId", String(teamId));
    }

    if (projectId !== undefined) {
      params.set(
        "ProjectId",
        String(projectId)
      );
    }

    if (search.trim()) {
      params.set("Search", search.trim());
    }

    const response = await fetch(
      `/api/team-projects?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch team projects"
      );
    }

    const data = await response.json();

    setTeamProjects(data.items ?? []);
    setTotalCount(data.totalCount ?? 0);

    return data;
  };

  const fetchOptions = async () => {
    const [teamsResponse, projectsResponse] =
      await Promise.all([
        fetch(
          "/api/teams?PageNumber=1&PageSize=100"
        ),
        fetch(
          "/api/projects?PageNumber=1&PageSize=100"
        ),
      ]);

    if (!teamsResponse.ok) {
      throw new Error(
        "Failed to fetch teams"
      );
    }

    if (!projectsResponse.ok) {
      throw new Error(
        "Failed to fetch projects"
      );
    }

    const teamsData =
      await teamsResponse.json();

    const projectsData =
      await projectsResponse.json();

    setTeams(
      (teamsData.items ?? []).map(
        (team: {
          id: number;
          nameAR: string;
          nameEN: string;
        }) => ({
          id: team.id,
          nameAR: team.nameAR,
          nameEN: team.nameEN,
        })
      )
    );

    setProjects(
      (projectsData.items ?? []).map(
        (project: {
          id: number;
          nameAr: string;
          nameEn: string;
        }) => ({
          id: project.id,
          nameAR: project.nameAr,
          nameEN: project.nameEn,
        })
      )
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchTeamProjects(
            1,
            pageSize,
            appliedFilters.search,
            appliedFilters.teamId,
            appliedFilters.projectId
          ),
          fetchOptions(),
        ]);
      } catch (error) {
        console.error(
          "Failed to fetch team projects:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePageChange = async (
    page: number
  ) => {
    try {
      setLoading(true);
      setCurrentPage(page);

      await fetchTeamProjects(
        page,
        pageSize,
        appliedFilters.search,
        appliedFilters.teamId,
        appliedFilters.projectId
      );
    } catch (error) {
      console.error(
        "Failed to fetch team projects:",
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

      await fetchTeamProjects(
        1,
        size,
        appliedFilters.search,
        appliedFilters.teamId,
        appliedFilters.projectId
      );
    } catch (error) {
      console.error(
        "Failed to change page size:",
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
        teamId: pendingTeamId,
        projectId: pendingProjectId,
      });

      setCurrentPage(1);

      await fetchTeamProjects(
        1,
        pageSize,
        trimmedSearch,
        pendingTeamId,
        pendingProjectId
      );
    } catch (error) {
      console.error(
        "Failed to apply team project filters:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    try {
      setLoading(true);

      setPendingTeamId(undefined);
      setPendingProjectId(undefined);

      setAppliedFilters({
        search: "",
        teamId: undefined,
        projectId: undefined,
      });

      setCurrentPage(1);

      await fetchTeamProjects(
        1,
        pageSize,
        "",
        undefined,
        undefined
      );
    } catch (error) {
      console.error(
        "Failed to reset filters:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTeamFilterChange = (
    value: string
  ) => {
    setPendingTeamId(
      value ? Number(value) : undefined
    );
  };

  const handleProjectFilterChange = (
    value: string
  ) => {
    setPendingProjectId(
      value ? Number(value) : undefined
    );
  };

  const handleCreateTeamProject = async (
    data: {
      teamId: number;
      projectId: number;
      descriptionAR: string | null;
      descriptionEN: string | null;
    }
  ): Promise<void> => {
    const response = await fetch(
      "/api/team-projects",
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
        "Failed to create team project"
      );
    }

    try {
      setLoading(true);

      await fetchTeamProjects(
        currentPage,
        pageSize,
        appliedFilters.search,
        appliedFilters.teamId,
        appliedFilters.projectId
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeamProject = async (
    id: number,
    data: {
      descriptionAR: string | null;
      descriptionEN: string | null;
    }
  ): Promise<void> => {
    const response = await fetch(
      `/api/team-projects/${id}`,
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
        "Failed to update team project"
      );
    }

    try {
      setLoading(true);

      await fetchTeamProjects(
        currentPage,
        pageSize,
        appliedFilters.search,
        appliedFilters.teamId,
        appliedFilters.projectId
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedTeamProjectForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (
    teamProject: TeamProject
  ) => {
    try {
      setIsLoadingDetails(true);
      setSelectedTeamProjectForEdit(
        teamProject
      );
      setIsModalOpen(true);

      const response = await fetch(
        `/api/team-projects/${teamProject.id}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch team project details"
        );
      }

      const data = await response.json();

      setSelectedTeamProjectForEdit(data);
    } catch (error) {
      console.error(
        "Failed to fetch team project details:",
        error
      );

      setIsModalOpen(false);
      setSelectedTeamProjectForEdit(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    if (isLoadingDetails || isDeleting) {
      return;
    }

    setIsModalOpen(false);
    setSelectedTeamProjectForEdit(null);
  };

  const handleOpenDeleteModal = (
    teamProject: TeamProject
  ) => {
    setSelectedTeamProjectForDelete(
      teamProject
    );
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setSelectedTeamProjectForDelete(null);
  };

  const handleDeleteTeamProject =
    async (): Promise<void> => {
      if (!selectedTeamProjectForDelete) {
        return;
      }

      try {
        setIsDeleting(true);

        const response = await fetch(
          `/api/team-projects/${selectedTeamProjectForDelete.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to delete team project"
          );
        }

        await fetchTeamProjects(
          currentPage,
          pageSize,
          appliedFilters.search,
          appliedFilters.teamId,
          appliedFilters.projectId
        );

        setIsDeleteModalOpen(false);
        setSelectedTeamProjectForDelete(null);
      } catch (error) {
        console.error(
          "Failed to delete team project:",
          error
        );
      } finally {
        setIsDeleting(false);
      }
    };

  const getTeamName = (
    teamProject: TeamProject
  ) => {
    return locale === "ar"
      ? teamProject.teamNameAr
      : teamProject.teamNameEn;
  };

  const getProjectName = (
    teamProject: TeamProject
  ) => {
    return locale === "ar"
      ? teamProject.projectNameAr
      : teamProject.projectNameEn;
  };

  if (loading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="animate-pulse">
          <div className="border-b border-slate-100 px-6 py-6">
            <div className="h-6 w-48 rounded-lg bg-slate-100" />
            <div className="mt-3 h-4 w-72 rounded-lg bg-slate-100" />
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
                  <div className="mt-2 h-3 w-28 rounded bg-slate-100" />
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
          filters={
            <div className="flex w-full items-center gap-3">
              <div className="flex-1">
                <FilterSelect
                  label={t("team")}
                  value={
                    pendingTeamId !== undefined
                      ? String(pendingTeamId)
                      : ""
                  }
                  onChange={(value) =>
                    handleTeamFilterChange(
                      value ?? ""
                    )
                  }
                  options={[
                    {
                      value: "",
                      label: t("allTeams"),
                    },
                    ...teams.map((team) => ({
                      value: String(team.id),
                      label:
                        locale === "ar"
                          ? team.nameAR
                          : team.nameEN,
                    })),
                  ]}
                />
              </div>

              <div className="flex-1">
                <FilterSelect
                  label={t("project")}
                  value={
                    pendingProjectId !== undefined
                      ? String(pendingProjectId)
                      : ""
                  }
                  onChange={(value) =>
                    handleProjectFilterChange(
                      value ?? ""
                    )
                  }
                  options={[
                    {
                      value: "",
                      label: t("allProjects"),
                    },
                    ...projects.map((project) => ({
                      value: String(project.id),
                      label:
                        locale === "ar"
                          ? project.nameAR
                          : project.nameEN,
                    })),
                  ]}
                />
              </div>
            </div>
          }
        />

        <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-center">
              <thead>
                <tr className="bg-[#1470ad]">
                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("team")}
                  </th>

                  <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t("project")}
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
                {teamProjects.map(
                  (teamProject) => {
                    const teamName =
                      getTeamName(teamProject);

                    const projectName =
                      getProjectName(
                        teamProject
                      );

                    return (
                      <tr
                        key={teamProject.id}
                        className="group border-b border-slate-200 transition-colors duration-200 odd:bg-white even:bg-slate-50 hover:bg-[#1470ad]/5"
                      >
                        <td className="border-e border-slate-200 px-6 py-5">
                          <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                            {teamName || "—"}
                          </span>
                        </td>

                        <td className="border-e border-slate-200 px-6 py-5">
                          <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                            {projectName || "—"}
                          </span>
                        </td>

                        <td className="border-e border-slate-200 px-6 py-5">
                          <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                            {teamProject.rate ??
                              "—"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="mx-auto flex w-fit items-center overflow-hidden rounded-xl border border-[#cbd6de] bg-white shadow-[0_3px_10px_rgba(8,29,56,0.07)] transition-all duration-200 group-hover:border-[#aebfc9] group-hover:shadow-[0_5px_16px_rgba(8,29,56,0.10)]">
                            <button
                              type="button"
                              aria-label={`${t("edit")} ${projectName || ""}`}
                              title={t("edit")}
                              onClick={() =>
                                handleOpenEditModal(
                                  teamProject
                                )
                              }
                              className="flex h-9 w-10 cursor-pointer items-center justify-center bg-[#eaf3f8] text-[#1470ad] transition-all duration-200 hover:bg-[#0f5f91] hover:text-white"
                            >
                              <EditOutlined className="text-[15px]" />
                            </button>

                            <span className="h-5 w-px bg-[#cbd6de]" />

                            <button
                              type="button"
                              aria-label={`${t("delete")} ${projectName || ""}`}
                              title={t("delete")}
                              onClick={() =>
                                handleOpenDeleteModal(
                                  teamProject
                                )
                              }
                              className="flex h-9 w-10 cursor-pointer items-center justify-center bg-[#fff0f0] text-[#ff0000] transition-all duration-200 hover:bg-[#ff0000] hover:text-white"
                            >
                              <DeleteOutlined className="text-[15px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>

            {teamProjects.length === 0 && (
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
      </div>

      {isModalOpen && (
        <TeamProjectModal
          key={
            selectedTeamProjectForEdit
              ? `edit-${selectedTeamProjectForEdit.id}`
              : "create"
          }
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateTeamProject}
          onUpdate={handleUpdateTeamProject}
          teamProject={
            selectedTeamProjectForEdit
          }
          teams={teams}
          projects={projects}
          isLoadingDetails={
            isLoadingDetails
          }
        />
      )}

      {isDeleteModalOpen &&
        selectedTeamProjectForDelete && (
          <DeleteTeamProjectModal
            teamProject={
              selectedTeamProjectForDelete
            }
            onClose={
              handleCloseDeleteModal
            }
            onConfirm={
              handleDeleteTeamProject
            }
          />
        )}

      
        {teamProjects.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalCount}
            onPageChange={handlePageChange}
            onPageSizeChange={
              handlePageSizeChange
            }
          />
        )}
    </>
  );
};

export default TeamProjectTable;