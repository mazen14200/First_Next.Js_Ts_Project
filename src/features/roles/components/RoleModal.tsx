"use client";

import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type {
  CreateRoleRequest,
  Role,
  UpdateRoleRequest,
} from "@/features/roles/types/role.types";

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoleRequest) => Promise<void>;
  onUpdate: (
    id: number,
    data: UpdateRoleRequest
  ) => Promise<void>;
  role?: Role | null;
}

const RoleModal = ({
  open,
  onClose,
  onSubmit,
  onUpdate,
  role,
}: RoleModalProps) => {
  const t = useTranslations("roles");

  const [nameAr, setNameAr] = useState(role?.nameAr ?? "");
  const [nameEn, setNameEn] = useState(role?.nameEn ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [isSaving, setIsSaving] = useState(false);

  if (!open) {
    return null;
  }

  const isEditMode = Boolean(role);

  const handleCreate = async () => {
    if (!nameAr.trim() || !nameEn.trim()) {
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        description: description.trim() || null,
      });

      setNameAr("");
      setNameEn("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Failed to create role:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!role || !nameAr.trim() || !nameEn.trim()) {
      return;
    }

    try {
      setIsSaving(true);

      await onUpdate(role.id, {
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        description: description.trim() || null,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update role:", error);
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
              {isEditMode ? t("editRole") : t("addRole")}
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
              htmlFor="role-name-ar"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("arabicName")}
            </label>

            <input
              id="role-name-ar"
              type="text"
              value={nameAr}
              onChange={(event) => setNameAr(event.target.value)}
              placeholder={t("nameArPlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10"
            />
          </div>

          {/* English Name */}
          <div>
            <label
              htmlFor="role-name-en"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("englishName")}
            </label>

            <input
              id="role-name-en"
              type="text"
              value={nameEn}
              onChange={(event) => setNameEn(event.target.value)}
              placeholder={t("nameEnPlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="role-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("descriptionLabel")}
            </label>

            <textarea
              id="role-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 resize-none"
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

export default RoleModal;
