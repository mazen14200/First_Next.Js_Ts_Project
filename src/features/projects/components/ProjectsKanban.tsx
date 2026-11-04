"use client";

import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";

import TablePagination from "../../../components/ui/TablePagination/TablePagination";
import styles from "./ProjectsKanban.module.css";

import type { Status } from "../../status";
import type { ProjectListItem } from "../types/project.types";

interface ProjectsKanbanProps {
  projects: ProjectListItem[];
  statuses: Status[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (project: ProjectListItem) => void;
  onDelete: (project: ProjectListItem) => void;
}

const ProjectsKanban = ({
  projects,
  statuses,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: ProjectsKanbanProps) => {
  const locale = useLocale();
  const t = useTranslations("projects");

  const getProjectName = (project: ProjectListItem) => {
    return locale === "ar" ? project.nameAr : project.nameEn;
  };

  const formatDate = (date: string | null) => {
    if (!date) {
      return "—";
    }

    return new Intl.DateTimeFormat(
      locale === "ar" ? "ar-EG" : "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  };

  const normalizeStatusName = (name: string | null) => {
    return name?.trim().toLowerCase() ?? "";
  };

  const getProjectsForStatus = (status: Status) => {
    return projects.filter(
      (project) =>
        normalizeStatusName(project.statusName) ===
        normalizeStatusName(status.name)
    );
  };

  const getScrollbarClass = (statusName: string | null) => {
    switch (normalizeStatusName(statusName)) {
      case "pending":
        return styles.pending;

      case "in progress":
        return styles.inProgress;

      case "completed":
        return styles.completed;

      case "cancelled":
        return styles.cancelled;

      case "on hold":
        return styles.onHold;

      default:
        return styles.unassigned;
    }
  };

  const unassignedProjects = projects.filter(
    (project) => !project.statusName?.trim()
  );

  const renderProjectCard = (
    project: ProjectListItem,
    statusColor: string
  ) => {
    const projectName = getProjectName(project);

    return (
      <article
        key={project.id}
        className="group relative h-full shrink-0 overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 "
      >
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ backgroundColor: statusColor }}
        />

        <div className="flex h-full flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <div
              className="inline-flex min-w-0 items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em]"
              style={{
                backgroundColor: `${statusColor}10`,
                color: statusColor,
              }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: statusColor }}
              />

              <span className="truncate">
                {project.statusName || t("unassigned")}
              </span>
            </div>

            <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[9px] font-bold tracking-[0.12em] text-slate-500">
              #{project.serialCode || "—"}
            </span>
          </div>

          <div className="mt-7 min-h-[76px]">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">
              {t("project")}
            </p>

            <h3 className="mt-2 line-clamp-2 text-[21px] font-bold leading-[1.2] tracking-[-0.035em] text-slate-800 transition-colors duration-300 group-hover:text-[#1470ad]">
              {projectName || "—"}
            </h3>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-400 transition-all duration-300 group-hover:border-[#1470ad]/15 group-hover:text-[#1470ad]"
              style={{ backgroundColor: `${statusColor}08` }}
            >
              <UserOutlined className="text-sm" />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {t("manager")}
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                {project.managerName || "—"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {t("fromDate")}
                </p>

                <p className="mt-1.5 truncate text-[11px] font-bold text-slate-700">
                  {formatDate(project.startDate)}
                </p>
              </div>

              <div className="flex flex-1 items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: statusColor }}
                />

                <span
                  className="h-[2px] flex-1 rounded-full"
                  style={{ backgroundColor: `${statusColor}25` }}
                />

                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: `${statusColor}70` }}
                />
              </div>

              <div className="min-w-0 text-end">
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {t("toDate")}
                </p>

                <p className="mt-1.5 truncate text-[11px] font-bold text-slate-700">
                  {formatDate(project.endDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-300">
                {t("project")}
              </span>

              <div
                className="mt-1 h-0.5 w-7 rounded-full transition-all duration-300 group-hover:w-11"
                style={{ backgroundColor: `${statusColor}45` }}
              />
            </div>

            <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => onEdit(project)}
                aria-label={`${t("edit")} ${projectName}`}
                title={t("edit")}
                className="flex h-8 w-9 cursor-pointer items-center justify-center border-e border-slate-200 text-slate-500 transition-all duration-200 hover:bg-[#1470ad] hover:text-white"
              >
                <EditOutlined className="text-xs" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(project)}
                aria-label={`${t("delete")} ${projectName}`}
                title={t("delete")}
                className="flex h-8 w-9 cursor-pointer items-center justify-center text-slate-500 transition-all duration-200 hover:bg-red-500 hover:text-white"
              >
                <DeleteOutlined className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const renderEmptyState = (statusColor: string) => {
    return (
      <div className="flex h-full shrink-0 items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white px-5 text-center shadow-[0_7px_20px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col items-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${statusColor}10`,
              color: statusColor,
            }}
          >
            <InboxOutlined className="text-lg" />
          </div>

          <p className="mt-4 text-[11px] font-semibold text-slate-400">
            {t("noProjectsInStatus")}
          </p>
        </div>
      </div>
    );
  };

  const renderStatusColumn = (
    status: Status,
    statusProjects: ProjectListItem[]
  ) => {
    const statusColor = status.colorCode || "#1470ad";

    return (
      <section
        key={status.id}
        className="flex h-[500px] min-h-0 min-w-0 flex-col rounded-[28px] border border-slate-200/90 bg-[#f1f4f7] p-2 shadow-[0_5px_18px_rgba(15,23,42,0.035)]"
      >
        <header className="shrink-0 rounded-[22px] bg-white px-5 py-4 shadow-[0_3px_12px_rgba(15,23,42,0.045)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: statusColor,
                  boxShadow: `0 0 0 4px ${statusColor}15`,
                }}
              />

              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-slate-800">
                  {status.name}
                </h2>

                <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {t("project")}
                </p>
              </div>
            </div>

            <span
              className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full px-2 text-[10px] font-bold shadow-[0_3px_9px_rgba(15,23,42,0.06)]"
              style={{
                backgroundColor: `${statusColor}10`,
                color: statusColor,
              }}
            >
              {String(statusProjects.length).padStart(2, "0")}
            </span>
          </div>
        </header>

        <div
          className={`${styles.scroll} ${getScrollbarClass(status.name)} mt-3 min-h-0 flex-1 overflow-y-auto px-1 pb-1 pe-2`}
        >
          {statusProjects.length > 0 ? (
            <div className="space-y-4">
              {statusProjects.map((project) =>
                renderProjectCard(project, statusColor)
              )}
            </div>
          ) : (
            renderEmptyState(statusColor)
          )}
        </div>
      </section>
    );
  };

  const renderUnassignedColumn = () => {
    return (
      <section className="flex h-[500px] min-h-0 min-w-0 flex-col rounded-[28px] border border-slate-200/90 bg-[#f1f4f7] p-2 shadow-[0_5px_18px_rgba(15,23,42,0.035)]">
        <header className="shrink-0 rounded-[22px] bg-white px-5 py-4 shadow-[0_3px_12px_rgba(15,23,42,0.045)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-400 shadow-[0_0_0_4px_rgba(148,163,184,0.12)]" />

              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-slate-800">
                  {t("unassigned")}
                </h2>

                <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {t("project")}
                </p>
              </div>
            </div>

            <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 px-2 text-[10px] font-bold text-slate-500 shadow-[0_3px_9px_rgba(15,23,42,0.05)]">
              {String(unassignedProjects.length).padStart(2, "0")}
            </span>
          </div>
        </header>

        <div
          className={`${styles.scroll} ${styles.unassigned} mt-3 min-h-0 flex-1 overflow-y-auto px-1 pb-1 pe-2`}
        >
          <div className="space-y-4">
            {unassignedProjects.length > 0 ? (
              unassignedProjects.map((project) =>
                renderProjectCard(project, "#94a3b8")
              )
            ) : (
              renderEmptyState("#94a3b8")
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-[#f8fafc] shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {statuses.map((status) =>
            renderStatusColumn(
              status,
              getProjectsForStatus(status)
            )
          )}

          {unassignedProjects.length > 0 &&
            renderUnassignedColumn()}
        </div>
      </div>

      {projects.length > 0 && (
        <div className="border-t border-slate-200/80 bg-white">
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalCount}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </section>
  );
};

export default ProjectsKanban;