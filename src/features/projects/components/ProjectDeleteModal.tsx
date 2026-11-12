"use client";

import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslations } from "next-intl";

import type { ProjectListItem } from "@/features/projects/types/project.types";

interface ProjectDeleteModalProps {
  open: boolean;
  project?: ProjectListItem | null;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
}

const ProjectDeleteModal = ({
  open,
  project,
  onClose,
  onDelete,
}: ProjectDeleteModalProps) => {
  const t = useTranslations("projects");

  const [isDeleting, setIsDeleting] = useState(false);

  if (!open || !project) {
    return null;
  }

  const projectName = project.nameEn || project.nameAr;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await onDelete(project.id);

      onClose();
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <DeleteOutlined className="text-base" />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {t("deleteProject")}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {t("deleteConfirmation")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label={t("cancel")}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        {/* Project */}
        <div className="px-6 py-5">
          <div className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-red-400">
              {t("project")}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-slate-700">
              {projectName || "—"}
            </p>

            {project.serialCode && (
              <p className="mt-1 text-xs font-medium text-slate-400">
                {project.serialCode}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <DeleteOutlined className="text-sm" />

            {isDeleting ? t("deleting") : t("confirmDelete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDeleteModal;