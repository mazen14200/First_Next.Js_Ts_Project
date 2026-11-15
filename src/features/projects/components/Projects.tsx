"use client";

import {
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import SectionLoader from "@/components/shared/feedback/SectionLoader";
import TableSkeleton from "@/components/shared/feedback/TableSkeleton";

import type {
  CreateProjectRequest,
  PaginatedProjectsResponse,
  Project,
  ProjectListItem,
  UpdateProjectRequest,
} from "@/features/projects/types/project.types";

import type { Status } from "@/features/status";

import ProjectsTable from "@/features/projects/components/ProjectsTable";

const ProjectsKanban = dynamic(
  () => import("@/features/projects/components/ProjectsKanban"),
  {
    loading: () => <SectionLoader variant="spinner" />,
  }
);

import ProjectModal from "@/features/projects/components/ProjectsModal";
import ProjectDeleteModal from "@/features/projects/components/ProjectDeleteModal";

import TableHeader from "@/components/ui/TableHeader/TableHeader";
import FilterSelect from "@/components/ui/FilterSelect/FilterSelect";
import DatePicker from "@/components/ui/DatePicker/DatePicker";

import { apiFetch } from "@/lib/api/client-fetch";

type ProjectsView = "table" | "kanban";

const DEFAULT_PAGE_SIZE = 10;

const Projects = () => {
  const t = useTranslations("projects");

  const [view, setView] =
    useState<ProjectsView>("table");

  const [paginatedResponse, setPaginatedResponse] =
    useState<PaginatedProjectsResponse | null>(null);

  const [statuses, setStatuses] =
    useState<Status[]>([]);

  const [newProjectCode, setNewProjectCode] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [statusesLoading, setStatusesLoading] =
    useState(true);

  const requestSeqRef = useRef(0);

  /*
   * Project Modal
   */
  const [isProjectModalOpen, setIsProjectModalOpen] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  /*
   * Delete Modal
   */
  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [projectToDelete, setProjectToDelete] =
    useState<ProjectListItem | null>(null);

  /*
   * Applied Search
   *
   * This is the Search value actually
   * sent to the API.
   */
  const [appliedSearch, setAppliedSearch] =
    useState("");

  /*
   * Project Filters
   */
  const [managerId, setManagerId] =
    useState("");

  const [statusId, setStatusId] =
    useState<number | undefined>(undefined);

  const [startDateFrom, setStartDateFrom] =
    useState("");

  const [startDateTo, setStartDateTo] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(DEFAULT_PAGE_SIZE);

  /*
   * Manager Options
   *
   * The Manager API is not available yet.
   * This will be populated once the backend
   * provides the managers endpoint.
   */
  const managerOptions: {
    value: string;
    label: string;
  }[] = [];

  /*
   * Fetch Projects
   */
  const fetchProjects = async (
    page: number,
    size: number,
    search: string,
    selectedManagerId: string,
    selectedStatusId?: number,
    selectedStartDateFrom?: string,
    selectedStartDateTo?: string
  ) => {
    const requestId = ++requestSeqRef.current;
    const isInitialLoad = paginatedResponse === null;

    if (isInitialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const params = new URLSearchParams({
      PageNumber: String(page),
      PageSize: String(size),
    });

    if (search.trim()) {
      params.set(
        "Search",
        search.trim()
      );
    }

    if (selectedManagerId) {
      params.set(
        "ManagerId",
        selectedManagerId
      );
    }

    if (
      selectedStatusId !== undefined
    ) {
      params.set(
        "StatusId",
        String(selectedStatusId)
      );
    }

    if (selectedStartDateFrom) {
      params.set(
        "StartDateFrom",
        selectedStartDateFrom
      );
    }

    if (selectedStartDateTo) {
      params.set(
        "StartDateTo",
        selectedStartDateTo
      );
    }

    try {
      const response = await apiFetch(
        `/api/projects?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch projects"
        );
      }

      const data: PaginatedProjectsResponse =
        await response.json();

      if (requestId === requestSeqRef.current) {
        setPaginatedResponse(data);
      }

      return data;
    } finally {
      if (requestId === requestSeqRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  /*
   * Fetch Statuses
   */
  const fetchStatuses = async () => {
    const response = await apiFetch(
      "/api/status"
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch statuses"
      );
    }

    const data: Status[] =
      await response.json();

    const sortedStatuses = [...data].sort(
      (a, b) =>
        (a.displayOrder ?? 999) -
        (b.displayOrder ?? 999)
    );

    setStatuses(sortedStatuses);

    return sortedStatuses;
  };

  /*
   * Initial Projects
   */
  useEffect(() => {
    const loadProjects = async () => {
      try {
        await fetchProjects(
          1,
          DEFAULT_PAGE_SIZE,
          "",
          "",
          undefined,
          "",
          ""
        );
      } catch (error) {
        console.error(
          "Failed to fetch projects:",
          error
        );
      }
    };

    loadProjects();
  }, []);

  /*
   * Initial Statuses
   */
  useEffect(() => {
    const loadStatuses = async () => {
      try {
        setStatusesLoading(true);

        await fetchStatuses();
      } catch (error) {
        console.error(
          "Failed to fetch statuses:",
          error
        );
      } finally {
        setStatusesLoading(false);
      }
    };

    loadStatuses();
  }, []);

  /*
   * Page Change
   */
  const handlePageChange = async (
    page: number
  ) => {
    try {
      setCurrentPage(page);

      await fetchProjects(
        page,
        pageSize,
        appliedSearch,
        managerId,
        statusId,
        startDateFrom,
        startDateTo
      );
    } catch (error) {
      console.error(
        "Failed to change projects page:",
        error
      );
    }
  };

  /*
   * Page Size Change
   */
  const handlePageSizeChange = async (
    size: number
  ) => {
    try {
      setPageSize(size);
      setCurrentPage(1);

      await fetchProjects(
        1,
        size,
        appliedSearch,
        managerId,
        statusId,
        startDateFrom,
        startDateTo
      );
    } catch (error) {
      console.error(
        "Failed to change project page size:",
        error
      );
    }
  };

  /*
   * Apply Search + Filters
   */
  const handleApplyFilters = async (
    search: string
  ) => {
    const trimmedSearch =
      search.trim();

    try {
      setAppliedSearch(
        trimmedSearch
      );

      setCurrentPage(1);

      await fetchProjects(
        1,
        pageSize,
        trimmedSearch,
        managerId,
        statusId,
        startDateFrom,
        startDateTo
      );
    } catch (error) {
      console.error(
        "Failed to apply project filters:",
        error
      );
    }
  };

  /*
   * Reset Search + Filters
   */
  const handleResetFilters = async () => {
    try {
      setAppliedSearch("");
      setManagerId("");
      setStatusId(undefined);
      setStartDateFrom("");
      setStartDateTo("");
      setCurrentPage(1);

      await fetchProjects(
        1,
        pageSize,
        "",
        "",
        undefined,
        "",
        ""
      );
    } catch (error) {
      console.error(
        "Failed to reset project filters:",
        error
      );
    }
  };

  /*
   * Open Add Project Modal
   */
  const handleOpenAddModal = async () => {
    try {
      const response = await apiFetch(
        "/api/projects/new-code"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to generate project code"
        );
      }

      const data: { code: string } =
        await response.json();

      setSelectedProject(null);
      setNewProjectCode(data.code);
      setIsProjectModalOpen(true);
    } catch (error) {
      console.error(
        "Failed to generate project code:",
        error
      );
    }
  };

  /*
   * Open Edit Project Modal
   *
   * The table only contains ProjectListItem,
   * so we fetch the full Project first.
   *
   * This does not affect the main projects
   * list loading state, so the table remains
   * visible while the details are loading.
   */
  const handleOpenEditModal = async (
    project: ProjectListItem
  ) => {
    try {
      const response = await apiFetch(
        `/api/projects/${project.id}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch project"
        );
      }

      const fullProject: Project =
        await response.json();

      setSelectedProject(fullProject);
      setIsProjectModalOpen(true);
    } catch (error) {
      console.error(
        "Failed to open project for editing:",
        error
      );
    }
  };

  /*
   * Close Project Modal
   */
  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
    setNewProjectCode("");
  };

  /*
   * Create Project
   */
  const handleCreateProject = async (
    data: CreateProjectRequest
  ) => {
    const response = await apiFetch(
      "/api/projects",
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
        "Failed to create project"
      );
    }

    await fetchProjects(
      currentPage,
      pageSize,
      appliedSearch,
      managerId,
      statusId,
      startDateFrom,
      startDateTo
    );

    handleCloseProjectModal();
  };

  /*
   * Update Project
   */
  const handleUpdateProject = async (
    id: number,
    data: UpdateProjectRequest
  ) => {
    const response = await apiFetch(
      `/api/projects/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to update project"
      );
    }

    await fetchProjects(
      currentPage,
      pageSize,
      appliedSearch,
      managerId,
      statusId,
      startDateFrom,
      startDateTo
    );

    handleCloseProjectModal();
  };

  /*
   * Open Delete Modal
   */
  const handleOpenDeleteModal = (
    project: ProjectListItem
  ) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  /*
   * Close Delete Modal
   */
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  /*
   * Delete Project
   */
  const handleDeleteProject = async (
    id: number
  ) => {
    const response = await apiFetch(
      `/api/projects/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to delete project"
      );
    }

    const data = await fetchProjects(
      currentPage,
      pageSize,
      appliedSearch,
      managerId,
      statusId,
      startDateFrom,
      startDateTo
    );

    /*
     * If the deleted project was the
     * last item on the current page,
     * move to the previous available page.
     */
    if (
      data.items.length === 0 &&
      currentPage > 1
    ) {
      const previousPage =
        currentPage - 1;

      setCurrentPage(previousPage);

      await fetchProjects(
        previousPage,
        pageSize,
        appliedSearch,
        managerId,
        statusId,
        startDateFrom,
        startDateTo
      );
    }
  };

  const projects =
    paginatedResponse?.items ?? [];

  const totalCount =
    paginatedResponse?.totalCount ?? 0;

  const safeCurrentPage =
    paginatedResponse?.pageNumber ??
    currentPage;

  const showInitialSkeleton =
    loading && paginatedResponse === null;

  return (
    <div className="space-y-5">
      {/* =========================
          Table Header
      ========================== */}
      <TableHeader
        title={t("title")}
        description={t("description")}
        recordCount={totalCount}
        currentPage={safeCurrentPage}
        pageSize={pageSize}
        pageSizeOptions={[
          5,
          10,
          20,
          50,
        ]}
        onPageSizeChange={
          handlePageSizeChange
        }
        onApplyFilters={
          handleApplyFilters
        }
        onResetFilters={
          handleResetFilters
        }
        onAdd={handleOpenAddModal}
        filters={
          <>
            <FilterSelect
              label={t("manager")}
              placeholder={t(
                "allManagers"
              )}
              value={
                managerId || undefined
              }
              options={managerOptions}
              onChange={(value) => {
                setManagerId(
                  value
                    ? String(value)
                    : ""
                );
              }}
              allowClear
              disabled={
                managerOptions.length ===
                0
              }
            />

            <FilterSelect
              label={t("status")}
              placeholder={t(
                "allStatuses"
              )}
              value={statusId}
              options={statuses.map(
                (status) => ({
                  value: status.id,
                  label: status.name,
                })
              )}
              onChange={(value) => {
                setStatusId(
                  value !== undefined
                    ? Number(value)
                    : undefined
                );
              }}
              allowClear
              loading={statusesLoading}
            />

            <DatePicker
              label={t("fromDate")}
              value={startDateFrom}
              onChange={
                setStartDateFrom
              }
            />

            <DatePicker
              label={t("toDate")}
              value={startDateTo}
              onChange={
                setStartDateTo
              }
            />
          </>
        }
      />

      {/* =========================
          View Switcher
      ========================== */}
      <div className="flex items-center justify-end">
        <div className="inline-flex items-center rounded-xl border border-[#d9e1e7] bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() =>
              setView("table")
            }
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              view === "table"
                ? "bg-[#1470ad] text-white shadow-sm"
                : "text-[#64748b] hover:bg-[#f4f7f9] hover:text-[#1470ad]"
            }`}
          >
            <BarsOutlined />

            <span>
              {t("tableView")}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setView("kanban")
            }
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              view === "kanban"
                ? "bg-[#1470ad] text-white shadow-sm"
                : "text-[#64748b] hover:bg-[#f4f7f9] hover:text-[#1470ad]"
            }`}
          >
            <AppstoreOutlined />

            <span>
              {t("kanbanView")}
            </span>
          </button>
        </div>
      </div>

      {/* =========================
          Content
      ========================== */}
      {showInitialSkeleton ? (
        <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-lg">
          <TableSkeleton columns={7} rows={5} />
        </section>
      ) : view === "table" ? (
        <ProjectsTable
          projects={projects}
          currentPage={safeCurrentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          refreshing={refreshing}
          onPageChange={
            handlePageChange
          }
          onPageSizeChange={
            handlePageSizeChange
          }
          onEdit={
            handleOpenEditModal
          }
          onDelete={
            handleOpenDeleteModal
          }
        />
      ) : (
        <ProjectsKanban
          projects={projects}
          statuses={statuses}
          currentPage={safeCurrentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={
            handlePageChange
          }
          onPageSizeChange={
            handlePageSizeChange
          }
          onEdit={
            handleOpenEditModal
          }
          onDelete={
            handleOpenDeleteModal
          }
        />
      )}

      {/* =========================
          Project Modal
      ========================== */}
      <ProjectModal
        key={
          selectedProject?.id ??
          newProjectCode ??
          "new"
        }
        open={isProjectModalOpen}
        project={selectedProject}
        statuses={statuses}
        initialSerialCode={newProjectCode}
        onClose={handleCloseProjectModal}
        onSubmit={handleCreateProject}
        onUpdate={handleUpdateProject}
      />

      {/* =========================
          Delete Modal
      ========================== */}
      <ProjectDeleteModal
        open={isDeleteModalOpen}
        project={projectToDelete}
        onClose={
          handleCloseDeleteModal
        }
        onDelete={
          handleDeleteProject
        }
      />
    </div>
  );
};

export default Projects;
