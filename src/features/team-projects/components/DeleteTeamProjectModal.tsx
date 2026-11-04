"use client";

import {
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";

import type { TeamProject } from "../types/team-project.types";

interface DeleteTeamProjectModalProps {
  teamProject: TeamProject;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteTeamProjectModal = ({
  teamProject,
  onClose,
  onConfirm,
}: DeleteTeamProjectModalProps) => {
  const locale = useLocale();
  const t = useTranslations("teamProjects");

  const teamName =
    locale === "ar"
      ? teamProject.teamNameAr
      : teamProject.teamNameEn;

  const projectName =
    locale === "ar"
      ? teamProject.projectNameAr
      : teamProject.projectNameEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <DeleteOutlined className="text-base" />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {t("deleteTeamProject")}
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {t("deleteConfirmation")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("cancel")}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        <div className="space-y-3 px-6 py-6">
          <div className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {t("team")}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {teamName || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {t("project")}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {projectName || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-md"
          >
            {t("confirmDelete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTeamProjectModal;