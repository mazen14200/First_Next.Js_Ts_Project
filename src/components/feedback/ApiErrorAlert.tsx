"use client";

import { useTranslations } from "next-intl";
import { CloseOutlined } from "@ant-design/icons";

import { apiErrorMessageKey } from "@/lib/api/error-message";

interface ApiErrorAlertProps {
  error: unknown;
  onRetry?: () => void;
  onClose?: () => void;
  retryLabel?: string;
  className?: string;
}

const ApiErrorAlert = ({
  error,
  onRetry,
  onClose,
  retryLabel,
  className = "",
}: ApiErrorAlertProps) => {
  const tCommon = useTranslations("common");

  if (!error) {
    return null;
  }

  const message = tCommon(
    `errors.${apiErrorMessageKey(error)}` as never
  );

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 ${className}`}
      role="alert"
    >
      <p className="text-sm font-medium text-red-600">
        {message}
      </p>

      <div className="flex shrink-0 items-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
          >
            {retryLabel ?? tCommon("errors.retry")}
          </button>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={tCommon("errors.dismiss")}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
          >
            <CloseOutlined className="text-xs" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ApiErrorAlert;
