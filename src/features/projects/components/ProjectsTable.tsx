"use client";

import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";

import TablePagination from "../../../components/ui/TablePagination/TablePagination";

import type { ProjectListItem } from "../types/project.types";

interface ProjectsTableProps {
  projects: ProjectListItem[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (project: ProjectListItem) => void;
  onDelete: (project: ProjectListItem) => void;
}

const ProjectsTable = ({
  projects,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: ProjectsTableProps) => {
  const t = useTranslations("projects");
  const locale = useLocale();

  const getProjectName = (project: ProjectListItem) => {
    return locale === "ar"
      ? project.nameAr
      : project.nameEn;
  };

  const formatDate = (date: string | null) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <>
      <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-center">
            <thead>
              <tr className="bg-[#1470ad]">
                <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  {t("project")}
                </th>

                <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  {t("serialCode")}
                </th>

                <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  {t("manager")}
                </th>

                <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  {t("status")}
                </th>

                <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  {t("fromDate")}
                </th>

                <th className="border-b border-e border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  {t("toDate")}
                </th>

                <th className="w-40 border-b border-white/20 px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  {t("actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => {
                const projectName =
                  getProjectName(project);

                return (
                  <tr
                    key={project.id}
                    className="group border-b border-slate-200 transition-colors duration-200 odd:bg-white even:bg-slate-50 hover:bg-[#1470ad]/5"
                  >
                    <td className="border-e border-slate-200 px-6 py-5">
                      <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                        {projectName || "—"}
                      </span>
                    </td>

                    <td className="border-e border-slate-200 px-6 py-5">
                      <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                        {project.serialCode || "—"}
                      </span>
                    </td>

                    <td className="border-e border-slate-200 px-6 py-5">
                      <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                        {project.managerName || "—"}
                      </span>
                    </td>

                    <td className="border-e border-slate-200 px-6 py-5">
                      <span className="inline-flex rounded-full bg-[#1470ad]/10 px-3 py-1 text-xs font-semibold text-[#1470ad]">
                        {project.statusName || "—"}
                      </span>
                    </td>

                    <td className="border-e border-slate-200 px-6 py-5">
                      <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                        {formatDate(project.startDate)}
                      </span>
                    </td>

                    <td className="border-e border-slate-200 px-6 py-5">
                      <span className="inline-flex rounded-lg px-2.5 py-1.5 text-sm text-slate-700 transition-all duration-200 group-hover:bg-[#1470ad] group-hover:text-white">
                        {formatDate(project.endDate)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="mx-auto flex w-fit items-center overflow-hidden rounded-xl border border-[#cbd6de] bg-white shadow-[0_3px_10px_rgba(8,29,56,0.07)] transition-all duration-200 group-hover:border-[#aebfc9] group-hover:shadow-[0_5px_16px_rgba(8,29,56,0.10)]">
                        <button
                          type="button"
                          onClick={() =>
                            onEdit(project)
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
                            onDelete(project)
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

          {projects.length === 0 && (
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
        currentPage={currentPage}
        pageSize={pageSize}
        total={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
};

export default ProjectsTable;
