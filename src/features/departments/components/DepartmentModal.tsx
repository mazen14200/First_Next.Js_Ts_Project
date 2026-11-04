"use client";

import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type {
  CreateDepartmentRequest,
  Department,
  UpdateDepartmentRequest,
} from "../types/department.types";

interface DepartmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDepartmentRequest) => Promise<void>;
  onUpdate: (
    id: number,
    data: UpdateDepartmentRequest
  ) => Promise<void>;
  department?: Department | null;
}

const DepartmentModal = ({
  open,
  onClose,
  onSubmit,
  onUpdate,
  department,
}: DepartmentModalProps) => {
  const t = useTranslations("departments");

  const [nameAR, setNameAR] = useState(department?.nameAR ?? "");
  const [nameEN, setNameEN] = useState(department?.nameEN ?? "");
  const [isSaving, setIsSaving] = useState(false);

  if (!open) {
    return null;
  }

  const isEditMode = Boolean(department);

  const handleCreate = async () => {
    if (!nameAR.trim() || !nameEN.trim()) {
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        nameAR: nameAR.trim(),
        nameEN: nameEN.trim(),
      });

      setNameAR("");
      setNameEN("");
      onClose();
    } catch (error) {
      console.error("Failed to create department:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!department || !nameAR.trim() || !nameEN.trim()) {
      return;
    }

    try {
      setIsSaving(true);

      await onUpdate(department.id, {
        nameAR: nameAR.trim(),
        nameEN: nameEN.trim(),
      });

      onClose();
    } catch (error) {
      console.error("Failed to update department:", error);
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
              {isEditMode ? t("editDepartment") : t("addDepartment")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("description")}
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
              htmlFor="department-name-ar"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("arabicName")}
            </label>

            <input
              id="department-name-ar"
              type="text"
              value={nameAR}
              onChange={(event) => setNameAR(event.target.value)}
              placeholder={t("arabicName")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10"
            />
          </div>

          {/* English Name */}
          <div>
            <label
              htmlFor="department-name-en"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("englishName")}
            </label>

            <input
              id="department-name-en"
              type="text"
              value={nameEN}
              onChange={(event) => setNameEN(event.target.value)}
              placeholder={t("englishName")}
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
            disabled={isSaving}
            className="rounded-xl bg-[#1470ad] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12639a] hover:shadow-md cursor-pointer"
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

export default DepartmentModal;