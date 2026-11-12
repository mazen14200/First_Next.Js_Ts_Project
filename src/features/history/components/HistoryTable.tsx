"use client";

import {
  ClockCircleOutlined,
  GlobalOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type { HistoryItem } from "@/features/history/types/history.types";

interface HistoryTableProps {
  history: HistoryItem[];
}

const HistoryTable = ({
  history,
}: HistoryTableProps) => {
  const t = useTranslations("history");

  const formatDateTime = (value: string) => {
    if (!value) {
      return t("noValue");
    }

    const [datePart = "", timePart = ""] =
      value.split("T");

    const formattedTime = timePart
      ? timePart.slice(0, 5)
      : "";

    return formattedTime
      ? `${datePart} · ${formattedTime}`
      : datePart || t("noValue");
  };

  const getStatusClassName = (
    statusCode: number
  ) => {
    if (
      statusCode >= 200 &&
      statusCode < 300
    ) {
      return "bg-[#eaf7ef] text-[#23844d]";
    }

    return "bg-[#fff0ed] text-[#c44932]";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7e0e7] bg-white shadow-[0_8px_24px_rgba(8,29,56,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse">
          <thead>
            <tr className="border-b border-[#dfe7ec] bg-[#f7f9fa]">
              <th className="px-5 py-4 text-start text-xs font-extrabold uppercase tracking-wide text-[#667985]">
                {t("operation")}
              </th>

              <th className="px-5 py-4 text-start text-xs font-extrabold uppercase tracking-wide text-[#667985]">
                {t("user")}
              </th>

              <th className="px-5 py-4 text-start text-xs font-extrabold uppercase tracking-wide text-[#667985]">
                {t("date")}
              </th>

              <th className="px-5 py-4 text-start text-xs font-extrabold uppercase tracking-wide text-[#667985]">
                {t("controller")}
              </th>

              <th className="px-5 py-4 text-start text-xs font-extrabold uppercase tracking-wide text-[#667985]">
                {t("action")}
              </th>

              <th className="px-5 py-4 text-start text-xs font-extrabold uppercase tracking-wide text-[#667985]">
                {t("ipAddress")}
              </th>

              <th className="px-5 py-4 text-center text-xs font-extrabold uppercase tracking-wide text-[#667985]">
                {t("status")}
              </th>

              <th className="px-5 py-4 text-start text-xs font-extrabold uppercase tracking-wide text-[#667985]">
                {t("affectedEntity")}
              </th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#edf1f4] last:border-b-0 transition-colors duration-150 hover:bg-[#f8fafb]"
              >
                {/* Operation */}
                <td className="px-5 py-4">
                  <div className="min-w-[150px]">
                    <span className="inline-flex rounded-lg bg-[#eaf3f8] px-2.5 py-1 text-xs font-extrabold text-[#1470ad]">
                      {item.operationKeyName ||
                        t("noValue")}
                    </span>

                    <p className="mt-1.5 text-sm font-semibold text-[#243d4d]">
                      {item.operation ||
                        t("noValue")}
                    </p>
                  </div>
                </td>

                {/* User */}
                <td className="px-5 py-4">
                  <div className="flex min-w-[150px] items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf3f7] text-[#1470ad]">
                      <UserOutlined className="text-sm" />
                    </div>

                    <span className="truncate text-sm font-semibold text-[#304b5d]">
                      {item.fullName ||
                        item.userName ||
                        t("noValue")}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-5 py-4">
                  <div className="flex min-w-[145px] items-center gap-2 text-sm text-[#506675]">
                    <ClockCircleOutlined className="shrink-0 text-[#1470ad]" />

                    <span className="font-medium">
                      {formatDateTime(
                        item.actionDate
                      )}
                    </span>
                  </div>
                </td>

                {/* Controller */}
                <td className="px-5 py-4">
                  <span
                    className="block max-w-[160px] truncate text-sm font-semibold text-[#304b5d]"
                    title={
                      item.controllerName ??
                      undefined
                    }
                  >
                    {item.controllerName ||
                      t("noValue")}
                  </span>
                </td>

                {/* Action */}
                <td className="px-5 py-4">
                  <span
                    className="block max-w-[160px] truncate text-sm font-semibold text-[#304b5d]"
                    title={
                      item.actionName ??
                      undefined
                    }
                  >
                    {item.actionName ||
                      t("noValue")}
                  </span>
                </td>

                {/* IP */}
                <td className="px-5 py-4">
                  <div className="flex min-w-[130px] items-center gap-2">
                    <GlobalOutlined className="shrink-0 text-[#1470ad]" />

                    <span className="truncate text-sm font-semibold text-[#304b5d]">
                      {item.ipAddress ||
                        t("noValue")}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex min-w-[54px] items-center justify-center rounded-lg px-2.5 py-1.5 text-xs font-extrabold ${getStatusClassName(
                      item.statusCode
                    )}`}
                  >
                    {item.statusCode}
                  </span>
                </td>

                {/* Affected Entity */}
                <td className="px-5 py-4">
                  <span className="text-sm font-semibold text-[#304b5d]">
                    {item.affectedEntityId ??
                      t("noValue")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;

