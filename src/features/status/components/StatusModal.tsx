"use client";

import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type {
  CreateStatusRequest,
  Status,
  UpdateStatusRequest,
} from "@/features/status/types/status.types";

interface StatusModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStatusRequest) => Promise<void>;
  onUpdate: (id: number, data: UpdateStatusRequest) => Promise<void>;
  status?: Status | null;
}

const StatusModal = ({
  open,
  onClose,
  onSubmit,
  onUpdate,
  status,
}: StatusModalProps) => {
  const t = useTranslations("status");

  const [name, setName] = useState(status?.name ?? "");

  const [description, setDescription] = useState(
    status?.description ?? ""
  );

  const [colorCode, setColorCode] = useState(
    status?.colorCode ?? ""
  );

  const [displayOrder, setDisplayOrder] = useState(
    status?.displayOrder !== null &&
    status?.displayOrder !== undefined
      ? String(status.displayOrder)
      : ""
  );

  const [isSaving, setIsSaving] = useState(false);

  const isEditMode = Boolean(status);

  if (!open) {
    return null;
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      const parsedDisplayOrder = displayOrder.trim()
        ? Number(displayOrder)
        : null;

      if (isEditMode && status) {
        const data: UpdateStatusRequest = {
          name: name.trim(),
          description: description.trim() || null,
          colorCode: colorCode.trim() || null,
          displayOrder: parsedDisplayOrder,
          isActive: status.isActive,
        };

        await onUpdate(status.id, data);
      } else {
        const data: CreateStatusRequest = {
          name: name.trim(),
          description: description.trim() || null,
          colorCode: colorCode.trim() || null,
          displayOrder: parsedDisplayOrder,
        };

        await onSubmit(data);
      }

      onClose();
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
                ? t("editStatus")
                : t("addStatus")}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {t("modalDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label={t("cancel")}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 px-6 py-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("name")}
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("namePlaceholder")}
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
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
              disabled={isSaving}
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {/* Color Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("colorCode")}
            </label>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={colorCode}
                onChange={(event) =>
                  setColorCode(event.target.value)
                }
                placeholder={t("colorCodePlaceholder")}
                disabled={isSaving}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              />

              <span
                className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 shadow-sm"
                style={{
                  backgroundColor:
                    colorCode.trim() || "#e2e8f0",
                }}
              />
            </div>
          </div>

          {/* Display Order */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("displayOrder")}
            </label>

            <input
              type="number"
              min="0"
              value={displayOrder}
              onChange={(event) =>
                setDisplayOrder(event.target.value)
              }
              placeholder={t("displayOrderPlaceholder")}
              disabled={isSaving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
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
            onClick={handleSubmit}
            disabled={isSaving || !name.trim()}
            className="cursor-pointer rounded-xl bg-[#1470ad] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12639a] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? t("saving")
              : isEditMode
                ? t("update")
                : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
