"use client";

import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type {
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
} from "../types/skills.types";

interface SkillModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSkillRequest) => Promise<void>;
  onUpdate: (id: number, data: UpdateSkillRequest) => Promise<void>;
  skill?: Skill | null;
}

export default function SkillModal({
  open,
  onClose,
  onSubmit,
  onUpdate,
  skill,
}: SkillModalProps) {
  const t = useTranslations("skills");

  const [nameAr, setNameAr] = useState(skill?.nameAr ?? "");
  const [nameEn, setNameEn] = useState(skill?.nameEn ?? "");
  const [description, setDescription] = useState(
    skill?.description ?? ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  const isEditMode = Boolean(skill);

  const handleSubmit = async () => {
    if (!nameAr.trim() || !nameEn.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        description: description.trim() || null,
      };

      if (isEditMode && skill) {
        await onUpdate(skill.id, data);
      } else {
        await onSubmit(data);
      }

      if (!isEditMode) {
        setNameAr("");
        setNameEn("");
        setDescription("");
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {isEditMode ? t("editSkill") : t("addSkill")}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {t("modalDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              text-slate-400
              transition-all duration-200
              hover:bg-slate-100
              hover:text-red-600
              disabled:cursor-not-allowed
              disabled:opacity-50
              cursor-pointer
            "
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 px-6 py-6">
          {/* Arabic Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("arabicName")}
            </label>

            <input
              type="text"
              value={nameAr}
              onChange={(event) =>
                setNameAr(event.target.value)
              }
              placeholder={t("nameArPlaceholder")}
              disabled={isSubmitting}
              className="
                w-full rounded-xl
                border border-slate-200
                bg-white px-4 py-3
                text-sm text-slate-700
                outline-none
                transition-all duration-200
                placeholder:text-slate-300
                focus:border-[#1470ad]
                focus:ring-4
                focus:ring-[#1470ad]/10
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />
          </div>

          {/* English Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("englishName")}
            </label>

            <input
              type="text"
              value={nameEn}
              onChange={(event) =>
                setNameEn(event.target.value)
              }
              placeholder={t("nameEnPlaceholder")}
              disabled={isSubmitting}
              className="
                w-full rounded-xl
                border border-slate-200
                bg-white px-4 py-3
                text-sm text-slate-700
                outline-none
                transition-all duration-200
                placeholder:text-slate-300
                focus:border-[#1470ad]
                focus:ring-4
                focus:ring-[#1470ad]/10
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("descriptionLabel")}
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder={t("descriptionPlaceholder")}
              disabled={isSubmitting}
              rows={4}
              className="
                w-full resize-none rounded-xl
                border border-slate-200
                bg-white px-4 py-3
                text-sm text-slate-700
                outline-none
                transition-all duration-200
                placeholder:text-slate-300
                focus:border-[#1470ad]
                focus:ring-4
                focus:ring-[#1470ad]/10
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              rounded-xl px-4 py-2.5
              text-sm font-semibold
              text-slate-500
              transition-all duration-200
              hover:bg-white
              hover:text-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
              cursor-pointer
            "
          >
            {t("cancel")}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !nameAr.trim() ||
              !nameEn.trim()
            }
            className="
              rounded-xl
              bg-[#1470ad]
              px-5 py-2.5
              text-sm font-semibold
              text-white
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-[#12639a]
              hover:shadow-md
              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:translate-y-0
              disabled:hover:shadow-none
              cursor-pointer
            "
          >
            {isSubmitting
              ? t("saving")
              : isEditMode
                ? t("update")
                : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
