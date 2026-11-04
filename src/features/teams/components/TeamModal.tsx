"use client";

import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type {
  CreateTeamRequest,
  Team,
  UpdateTeamRequest,
} from "../types/team.types";

interface TeamModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTeamRequest) => Promise<void>;
  onUpdate: (
    id: number,
    data: UpdateTeamRequest
  ) => Promise<void>;
  team?: Team | null;
}

const TeamModal = ({
  open,
  onClose,
  onSubmit,
  onUpdate,
  team,
}: TeamModalProps) => {
  const t = useTranslations("teams");

  const [nameAR, setNameAR] = useState(team?.nameAR ?? "");
  const [nameEN, setNameEN] = useState(team?.nameEN ?? "");
  const [rate, setRate] = useState(
    team?.rate !== undefined && team?.rate !== null
      ? String(team.rate)
      : ""
  );

  const [isSaving, setIsSaving] = useState(false);

  if (!open) {
    return null;
  }

  const isEditMode = Boolean(team);

  const handleCreate = async () => {
    if (
      !nameAR.trim() ||
      !nameEN.trim() ||
      !rate.trim()
    ) {
      return;
    }

    const numericRate = Number(rate);

    if (!Number.isFinite(numericRate)) {
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        nameAR: nameAR.trim(),
        nameEN: nameEN.trim(),
        rate: numericRate,
      });

      setNameAR("");
      setNameEN("");
      setRate("");
      onClose();
    } catch (error) {
      console.error("Failed to create team:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (
      !team ||
      !nameAR.trim() ||
      !nameEN.trim() ||
      !rate.trim()
    ) {
      return;
    }

    const numericRate = Number(rate);

    if (!Number.isFinite(numericRate)) {
      return;
    }

    try {
      setIsSaving(true);

      await onUpdate(team.id, {
        nameAR: nameAR.trim(),
        nameEN: nameEN.trim(),
        rate: numericRate,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update team:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {isEditMode
                ? t("editTeam")
                : t("addTeam")}
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
          {/* Arabic Name */}
          <div>
            <label
              htmlFor="team-name-ar"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("nameAR")}
            </label>

            <input
              id="team-name-ar"
              type="text"
              value={nameAR}
              onChange={(event) =>
                setNameAR(event.target.value)
              }
              placeholder={t("nameAR")}
              disabled={isSaving}
              dir="rtl"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {/* English Name */}
          <div>
            <label
              htmlFor="team-name-en"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("nameEN")}
            </label>

            <input
              id="team-name-en"
              type="text"
              value={nameEN}
              onChange={(event) =>
                setNameEN(event.target.value)
              }
              placeholder={t("nameEN")}
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {/* Rate */}
          <div>
            <label
              htmlFor="team-rate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("rate")}
            </label>

            <input
              id="team-rate"
              type="number"
              min="0"
              step="any"
              value={rate}
              onChange={(event) =>
                setRate(event.target.value)
              }
              placeholder={t("ratePlaceholder")}
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>
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
              isSaving ||
              !nameAR.trim() ||
              !nameEN.trim() ||
              !rate.trim()
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

export default TeamModal;
