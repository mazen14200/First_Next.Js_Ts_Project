"use client";

import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";

import FilterSelect from "@/components/ui/FilterSelect/FilterSelect";

import type {
  CreateTeamProjectRequest,
  TeamProject,
  TeamProjectOption,
  UpdateTeamProjectRequest,
} from "@/features/team-projects/types/team-project.types";

interface TeamProjectModalProps {
  open: boolean;
  onClose: () => void;

  onSubmit: (
    data: CreateTeamProjectRequest
  ) => Promise<void>;

  onUpdate: (
    id: number,
    data: UpdateTeamProjectRequest
  ) => Promise<void>;

  teamProject?: TeamProject | null;

  teams: TeamProjectOption[];
  projects: TeamProjectOption[];

  isLoadingDetails?: boolean;
}

const TeamProjectModal = ({
  open,
  onClose,
  onSubmit,
  onUpdate,
  teamProject,
  teams,
  projects,
  isLoadingDetails = false,
}: TeamProjectModalProps) => {
  const locale = useLocale();
  const t = useTranslations("teamProjects");

  const [teamId, setTeamId] = useState(
    teamProject ? String(teamProject.teamId) : ""
  );

  const [projectId, setProjectId] = useState(
    teamProject ? String(teamProject.projectId) : ""
  );

  const [descriptionAR, setDescriptionAR] = useState(
    teamProject?.descriptionAR ?? ""
  );

  const [descriptionEN, setDescriptionEN] = useState(
    teamProject?.descriptionEN ?? ""
  );

  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = Boolean(teamProject);

  if (!open) {
    return null;
  }

  const handleCreate = async () => {
    if (!teamId || !projectId) {
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        teamId: Number(teamId),
        projectId: Number(projectId),
        descriptionAR:
          descriptionAR.trim() || null,
        descriptionEN:
          descriptionEN.trim() || null,
      });

      onClose();
    } catch (error) {
      console.error(
        "Failed to create team project:",
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!teamProject) {
      return;
    }

    try {
      setIsSaving(true);

      await onUpdate(teamProject.id, {
        descriptionAR:
          descriptionAR.trim() || null,
        descriptionEN:
          descriptionEN.trim() || null,
      });

      onClose();
    } catch (error) {
      console.error(
        "Failed to update team project:",
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled =
    isSaving || isLoadingDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {isEditMode
                ? t("editTeamProject")
                : t("addTeamProject")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("description")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("cancel")}
            disabled={isSaving}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 px-6 py-6">
          {/* Team */}
          <FilterSelect
            label={t("team")}
            value={teamId}
            onChange={(value) =>
              setTeamId(value ?? "")
            }
            disabled={isDisabled || isEditMode}
            options={[
              {
                value: "",
                label: t("selectTeam"),
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

          {/* Project */}
          <FilterSelect
            label={t("project")}
            value={projectId}
            onChange={(value) =>
              setProjectId(value ?? "")
            }
            disabled={isDisabled || isEditMode}
            options={[
              {
                value: "",
                label: t("selectProject"),
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

          {/* Arabic Description */}
          <div>
            <label
              htmlFor="team-project-description-ar"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("descriptionAR")}
            </label>

            <textarea
              id="team-project-description-ar"
              value={descriptionAR}
              onChange={(event) =>
                setDescriptionAR(
                  event.target.value
                )
              }
              placeholder={t(
                "descriptionARPlaceholder"
              )}
              disabled={isDisabled}
              rows={4}
              dir="rtl"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {/* English Description */}
          <div>
            <label
              htmlFor="team-project-description-en"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("descriptionEN")}
            </label>

            <textarea
              id="team-project-description-en"
              value={descriptionEN}
              onChange={(event) =>
                setDescriptionEN(
                  event.target.value
                )
              }
              placeholder={t(
                "descriptionENPlaceholder"
              )}
              disabled={isDisabled}
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {isLoadingDetails && (
            <p className="text-xs text-slate-400">
              {t("loadingDetails")}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={
              isEditMode
                ? handleUpdate
                : handleCreate
            }
            disabled={
              isDisabled ||
              (!isEditMode &&
                (!teamId || !projectId))
            }
            className="cursor-pointer rounded-xl bg-[#1470ad] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12639a] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? "..."
              : isEditMode
                ? t("update")
                : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamProjectModal;