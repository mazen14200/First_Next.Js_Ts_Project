"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { DeleteOutlined } from "@ant-design/icons";
import { Modal } from "antd";

import styles from "./KanbanBoard.module.css";

import ProjectModal from "../../../projects/components/ProjectsModal";

import type { Column, Columns, Project } from "../../types/Kanban.types";
import type { Status } from "../../types/status.types";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../../projects/types/project.types";

import { apiFetch } from "../../../../lib/api/client-fetch";

export default function KanbanBoard() {
  const t = useTranslations("dashboard.kanban");
  const locale = useLocale()

  const [columns, setColumns] = useState<Columns>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadKanbanData = async () => {
    try {
      const [statusesResponse, projectsResponse] = await Promise.all([
        apiFetch("/api/dashboard/statuses"),
        apiFetch("/api/dashboard/projects"),
      ]);

      if (!statusesResponse.ok) {
        throw new Error("Failed to fetch statuses");
      }

      if (!projectsResponse.ok) {
        throw new Error("Failed to fetch projects");
      }

      const fetchedStatuses: Status[] = await statusesResponse.json();
      const projectsData = await projectsResponse.json();

      const projects: Project[] = projectsData.items;

      const validStatuses = fetchedStatuses.filter(
        (status) => status.name.trim() !== ""
      );

      const statusColumns: Columns = validStatuses.map(
        (status): Column => ({
          id: status.id,
          name: status.name,
          colorCode: status.colorCode,
          projects: projects.filter(
            (project) => project.statusName === status.name
          ),
        })
      );

      setColumns(statusColumns);
      setStatuses(validStatuses);
    } catch (error) {
      console.error("Failed to fetch kanban data:", error);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadKanbanData);
  }, []);

  const handleDeleteProject = (projectId: number) => {
    Modal.confirm({
      title: locale === "ar" ? "حذف المشروع" : "Delete Project",

      content:
        locale === "ar"
          ? "هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء."
          : "Are you sure you want to delete this project? This action cannot be undone.",

      okText: locale === "ar" ? "حذف" : "Delete",
      cancelText: locale === "ar" ? "إلغاء" : "Cancel",

      okButtonProps: {
        danger: true,
      },

      onOk: async () => {
        try {
          const response = await apiFetch(
            `/api/dashboard/projects/${projectId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            const errorData = await response.json();

            console.error("DELETE PROJECT ERROR:", errorData);

            throw new Error(
              errorData.detail ||
                errorData.message ||
                "Failed to delete project"
            );
          }

          // Remove the deleted project from the current Kanban state
          setColumns((currentColumns) =>
            currentColumns.map((column) => ({
              ...column,
              projects: column.projects.filter(
                (project) => project.id !== projectId
              ),
            }))
          );

        } catch (error) {
          console.error("FAILED TO DELETE PROJECT:", error);
        }
      },
    });
  };

  const handleCreateProject = async (
    data: CreateProjectRequest
  ) => {
    const response = await apiFetch("/api/dashboard/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.message || "Failed to create project"
      );
    }

    setIsModalOpen(false);
    await loadKanbanData();
  };

  const handleUpdateProject = async (
    id: number,
    data: UpdateProjectRequest
  ) => {
    const response = await apiFetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.message || "Failed to update project"
      );
    }

    setIsModalOpen(false);
    await loadKanbanData();
  };

  const totalTasks = columns.reduce(
    (total, column) => total + column.projects.length,
    0
  );

  return (
    <section className={styles.kanbanSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionInfo}>
          <span className={styles.eyebrow}>
            {t("eyebrow")}
          </span>

          <h2 className={styles.title}>
            {t("title")}
          </h2>

          <p className={styles.subtitle}>
            {t("description")}
          </p>
        </div>

        <div className="flex items-center gap-5">

          <div className={styles.totalTasks}>
            <span>{t("totalTasks")}</span>
            <strong>{totalTasks}</strong>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-[#1470ad] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1470ad]/85 cursor-pointer"
          >
            {locale === "ar" ? '+ إضافة مشروع' : '+ Add Project'}
          </button>

        </div>

      </div>

      <div className={styles.board}>
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>


      {isModalOpen && (
        <ProjectModal
          open={isModalOpen}
          statuses={statuses}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateProject}
          onUpdate={handleUpdateProject}
        />
      )}
    </section>
  );
}

function KanbanColumn({
    column,
    onDelete,
  }: {
    column: Column;
    onDelete: (projectId: number) => void;
  }) {
  const locale = useLocale()
  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: column.colorCode ?? "#6c757d",
            }}
          />

          <h3 className={styles.columnTitle}>
            {column.name}
          </h3>
        </div>

        <span className={styles.count}>
          {column.projects.length}
        </span>
      </div>

      <div className={styles.cards}>
        {column.projects.length === 0 ? (
          <div className="text-sm text-black/40 text-center py-8">
            {locale === "ar" ? "لا توجد مشاريع حالياً" : "No projects yet"}
          </div>
        ) : (
          column.projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-black/10 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-semibold leading-5 text-black">
                  {locale === "ar" ? project.nameAr : project.nameEn}
                </h4>

              <button
                type="button"
                onClick={() => onDelete(project.id)}
                className="cursor-pointer text-red-500 transition hover:text-red-700"
                title={locale === "ar" ? "حذف المشروع" : "Delete project"}
              >
                <DeleteOutlined />
              </button>
              </div>

              <span className="mt-3 inline-block rounded-md bg-black/5 px-2 py-1 text-[11px] font-medium text-black/60">
                {project.serialCode}
              </span>

              <div className="mt-4 space-y-2 border-t border-black/5 pt-3">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-black/40">
                    {locale === "ar" ? "تاريخ البدء" : "Start Date"}
                  </span>

                  <span className="font-medium text-black/60">
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-black/40">
                    {locale === "ar" ? "تاريخ الانتهاء" : "End Date"}
                  </span>

                  <span className="font-medium text-black/60">
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {project.managerName && (
                <div className="mt-3 border-t border-black/5 pt-3 text-xs">
                  <span className="text-black/40">
                    Manager
                  </span>

                  <p className="mt-1 font-medium text-black/70">
                    {project.managerName}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}