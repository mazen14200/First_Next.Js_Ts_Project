"use client";

import type { ReactNode } from "react";
import {
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message?: string;
  itemLabel?: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: "danger" | "primary";
  icon?: ReactNode;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

const ConfirmModal = ({
  open,
  title,
  message,
  itemLabel,
  confirmLabel,
  cancelLabel,
  variant = "danger",
  icon,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  if (!open) {
    return null;
  }

  const isDanger = variant === "danger";

  const defaultIcon = isDanger ? (
    <DeleteOutlined className="text-base" />
  ) : (
    <CheckCircleOutlined className="text-base" />
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                isDanger
                  ? "bg-red-50 text-red-500"
                  : "bg-[#eaf3f8] text-[#1470ad]"
              }`}
            >
              {icon ?? defaultIcon}
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {title}
              </h2>

              {message && (
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {message}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={cancelLabel}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        {/* Item */}
        {itemLabel && (
          <div className="px-6 py-6">
            <div
              className={`rounded-xl border px-4 py-3 ${
                isDanger
                  ? "border-red-100 bg-red-50/60"
                  : "border-[#cfe0ee] bg-[#f4f9fc]"
              }`}
            >
              <p className="text-sm font-semibold text-slate-800">
                {itemLabel}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${
              isDanger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#1470ad] hover:bg-[#0f5f91]"
            }`}
          >
            {loading ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
