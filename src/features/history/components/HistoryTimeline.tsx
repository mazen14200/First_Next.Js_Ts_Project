"use client";

import {
CheckCircleOutlined,
ClockCircleOutlined,
GlobalOutlined,
LinkOutlined,
UserOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type { HistoryItem } from "@/features/history/types/history.types";

interface HistoryActivityCardProps {
item: HistoryItem;
position?: "left" | "right";
}

const HistoryActivityCard = ({
item,
position = "left",
}: HistoryActivityCardProps) => {
const t = useTranslations("history");

const [datePart = "", timePart = ""] =
item.actionDate.split("T");

const formattedDate =
datePart || t("noValue");

const formattedTime = timePart
? timePart.slice(0, 5)
: t("noValue");

const isLeft = position === "left";

return ( <div className="relative grid grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] items-start">
{/* Left side */}
<div
className={`min-w-0 ${
          isLeft
            ? "pe-6 lg:pe-10"
            : "pointer-events-none"
        }`}
>
{isLeft && ( <div className="group relative rounded-xl border border-[#d7e0e7] bg-white p-5 shadow-[0_6px_22px_rgba(8,29,56,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b9ccd8] hover:shadow-[0_12px_30px_rgba(8,29,56,0.10)]">
{/* Card Header */} <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"> <div className="min-w-0"> <div className="flex flex-wrap items-center gap-2"> <span className="rounded-md bg-[#eaf3f8] px-2.5 py-1 text-xs font-extrabold text-[#1470ad]">
{item.operationKeyName ||
t("noValue")} </span>


              <span className="text-sm font-bold text-[#1c3546]">
                {item.operation ||
                  t("noValue")}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#718391]">
              <span className="inline-flex items-center gap-1.5">
                <UserOutlined />

                <span className="font-semibold">
                  {item.fullName ||
                    item.userName ||
                    t("noValue")}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <ClockCircleOutlined />

                <span>
                  {formattedDate} ·{" "}
                  {formattedTime}
                </span>
              </span>
            </div>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center rounded-md px-2.5 py-1 text-xs font-bold ${
              item.statusCode >= 200 &&
              item.statusCode < 300
                ? "bg-[#eaf7ef] text-[#23844d]"
                : "bg-[#fff0ed] text-[#c44932]"
            }`}
          >
            {item.statusCode}
          </span>
        </div>

        {/* Details */}
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#e5ebef] pt-4 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8999a5]">
              {t("controller")}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#304b5d]">
              {item.controllerName ||
                t("noValue")}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8999a5]">
              {t("action")}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#304b5d]">
              {item.actionName ||
                t("noValue")}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8999a5]">
              {t("ipAddress")}
            </p>

            <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-semibold text-[#304b5d]">
              <GlobalOutlined className="shrink-0 text-[#1470ad]" />

              <span className="truncate">
                {item.ipAddress ||
                  t("noValue")}
              </span>
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8999a5]">
              {t("affectedEntity")}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#304b5d]">
              {item.affectedEntityId ??
                t("noValue")}
            </p>
          </div>
        </div>

        {/* Request Path */}
        {item.requestPath && (
          <div className="mt-4 flex min-w-0 items-start gap-2 rounded-lg border border-[#e2e9ee] bg-[#f7f9fa] px-3.5 py-3">
            <LinkOutlined className="mt-0.5 shrink-0 text-[#1470ad]" />

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8999a5]">
                {t("requestPath")}
              </p>

              <p className="mt-0.5 break-all text-xs font-medium text-[#506675]">
                {item.requestPath}
              </p>
            </div>
          </div>
        )}
      </div>
    )}
  </div>

  {/* Center Timeline */}
  <div className="relative flex min-h-full justify-center">
    <div className="absolute start-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#d7e2e8]" />

    <div className="relative z-10 mt-5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-[#f7f9fa] bg-[#1470ad] text-white shadow-[0_4px_14px_rgba(20,112,173,0.24)] transition-all duration-200 hover:scale-105">
      <CheckCircleOutlined className="text-base" />
    </div>
  </div>

  {/* Right side */}
  <div
    className={`min-w-0 ${
      !isLeft
        ? "ps-6 lg:ps-10"
        : "pointer-events-none"
    }`}
  >
    {!isLeft && (
      <div className="group relative rounded-xl border border-[#d7e0e7] bg-white p-5 shadow-[0_6px_22px_rgba(8,29,56,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b9ccd8] hover:shadow-[0_12px_30px_rgba(8,29,56,0.10)]">
        {/* Card Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#eaf3f8] px-2.5 py-1 text-xs font-extrabold text-[#1470ad]">
                {item.operationKeyName ||
                  t("noValue")}
              </span>

              <span className="text-sm font-bold text-[#1c3546]">
                {item.operation ||
                  t("noValue")}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#718391]">
              <span className="inline-flex items-center gap-1.5">
                <UserOutlined />

                <span className="font-semibold">
                  {item.fullName ||
                    item.userName ||
                    t("noValue")}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <ClockCircleOutlined />

                <span>
                  {formattedDate} ·{" "}
                  {formattedTime}
                </span>
              </span>
            </div>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center rounded-md px-2.5 py-1 text-xs font-bold ${
              item.statusCode >= 200 &&
              item.statusCode < 300
                ? "bg-[#eaf7ef] text-[#23844d]"
                : "bg-[#fff0ed] text-[#c44932]"
            }`}
          >
            {item.statusCode}
          </span>
        </div>

        {/* Details */}
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#e5ebef] pt-4 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8999a5]">
              {t("controller")}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#304b5d]">
              {item.controllerName ||
                t("noValue")}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8999a5]">
              {t("action")}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#304b5d]">
              {item.actionName ||
                t("noValue")}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8999a5]">
              {t("ipAddress")}
            </p>

            <p className="mt-1 flex items-center gap-1.5 truncate text-sm font-semibold text-[#304b5d]">
              <GlobalOutlined className="shrink-0 text-[#1470ad]" />

              <span className="truncate">
                {item.ipAddress ||
                  t("noValue")}
              </span>
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8999a5]">
              {t("affectedEntity")}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#304b5d]">
              {item.affectedEntityId ??
                t("noValue")}
            </p>
          </div>
        </div>

        {/* Request Path */}
        {item.requestPath && (
          <div className="mt-4 flex min-w-0 items-start gap-2 rounded-lg border border-[#e2e9ee] bg-[#f7f9fa] px-3.5 py-3">
            <LinkOutlined className="mt-0.5 shrink-0 text-[#1470ad]" />

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8999a5]">
                {t("requestPath")}
              </p>

              <p className="mt-0.5 break-all text-xs font-medium text-[#506675]">
                {item.requestPath}
              </p>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
</div>


);
};

export default HistoryActivityCard;
