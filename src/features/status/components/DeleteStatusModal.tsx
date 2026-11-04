"use client";

import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

interface DeleteStatusModalProps {
  open: boolean;
  statusName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteStatusModal = ({
  open,
  statusName,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteStatusModalProps) => {
  const t = useTranslations("status");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <DeleteOutlined className="text-base" />
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {t("deleteStatus")}
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
            disabled={isDeleting}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        {/* Status */}
        <div className="px-6 py-6">
          <div className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">
              {statusName}
            </p>
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
            onClick={onConfirm}
            disabled={isDeleting}
            className="cursor-pointer rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "..." : t("confirmDelete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStatusModal;

