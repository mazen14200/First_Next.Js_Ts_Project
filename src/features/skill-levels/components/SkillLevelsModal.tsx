"use client";

import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type {
  CreateSkillLevelRequest,
  SkillLevel,
  UpdateSkillLevelRequest,
} from "@/features/skill-levels/types/skill-levels.types";

interface SkillLevelModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSkillLevelRequest) => Promise<void>;
  onUpdate: (
    id: number,
    data: UpdateSkillLevelRequest
  ) => Promise<void>;
  skillLevel?: SkillLevel | null;
}

const SkillLevelsModal = ({
  open,
  onClose,
  onSubmit,
  onUpdate,
  skillLevel,
}: SkillLevelModalProps) => {
  const t = useTranslations("skillLevels");

  const [nameAr, setNameAr] = useState(skillLevel?.nameAr ?? "");
  const [nameEn, setNameEn] = useState(skillLevel?.nameEn ?? "");
  const [rank, setRank] = useState(
    skillLevel?.rank?.toString() ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!open) {
    return null;
  }

  const isEditMode = Boolean(skillLevel);

  const handleCreate = async () => {
    if (!nameAr.trim() || !nameEn.trim() || !rank.trim()) {
      return;
    }

    const parsedRank = Number(rank);

    if (Number.isNaN(parsedRank)) {
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        rank: parsedRank,
      });

      setNameAr("");
      setNameEn("");
      setRank("");

      onClose();
    } catch (error) {
      console.error("Failed to create skill level:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (
      !skillLevel ||
      !nameAr.trim() ||
      !nameEn.trim() ||
      !rank.trim()
    ) {
      return;
    }

    const parsedRank = Number(rank);

    if (Number.isNaN(parsedRank)) {
      return;
    }

    try {
      setIsSaving(true);

      await onUpdate(skillLevel.id, {
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        rank: parsedRank,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update skill level:", error);
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
                ? t("editSkillLevel")
                : t("addSkillLevel")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("modalDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("cancel")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-red-600 cursor-pointer"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 px-6 py-6">
          {/* Arabic Name */}
          <div>
            <label
              htmlFor="skill-level-name-ar"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("arabicName")}
            </label>

            <input
              id="skill-level-name-ar"
              type="text"
              value={nameAr}
              onChange={(event) => setNameAr(event.target.value)}
              placeholder={t("arabicName")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10"
            />
          </div>

          {/* English Name */}
          <div>
            <label
              htmlFor="skill-level-name-en"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("englishName")}
            </label>

            <input
              id="skill-level-name-en"
              type="text"
              value={nameEn}
              onChange={(event) => setNameEn(event.target.value)}
              placeholder={t("englishName")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10"
            />
          </div>

          {/* Rank */}
          <div>
            <label
              htmlFor="skill-level-rank"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("rank")}
            </label>

            <input
              id="skill-level-rank"
              type="number"
              min="1"
              value={rank}
              onChange={(event) => setRank(event.target.value)}
              placeholder={t("rank")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={isEditMode ? handleUpdate : handleCreate}
            disabled={
              isSaving ||
              !nameAr.trim() ||
              !nameEn.trim()
            }
            className="rounded-xl bg-[#1470ad] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12639a] hover:shadow-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
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

export default SkillLevelsModal
