"use client";

import { CloseOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import { useState } from "react";
import { useTranslations } from "next-intl";

import DatePicker from "../../../components/ui/DatePicker/DatePicker";

import type {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
} from "../types/project.types";

import type { Status } from "../../status";

interface ProjectModalProps {
  open: boolean;
  project?: Project | null;
  statuses: Status[];
  initialSerialCode?: string;
  onClose: () => void;
  onSubmit: (
    data: CreateProjectRequest
  ) => Promise<void>;
  onUpdate: (
    id: number,
    data: UpdateProjectRequest
  ) => Promise<void>;
}

const ProjectModal = ({
  open,
  project,
  statuses,
  initialSerialCode = "",
  onClose,
  onSubmit,
  onUpdate,
}: ProjectModalProps) => {
  const t = useTranslations("projects");

  const isEditMode = Boolean(project);

  const [nameAr, setNameAr] = useState(
    project?.nameAr ?? ""
  );

  const [nameEn, setNameEn] = useState(
    project?.nameEn ?? ""
  );

  const [serialCode, setSerialCode] =
    useState(
      project?.serialCode ??
        initialSerialCode
    );

  const [statusId, setStatusId] =
    useState<number | null>(
      project?.statusId ?? null
    );

  const [description, setDescription] =
    useState(
      project?.description ?? ""
    );

  const [startDate, setStartDate] =
    useState(
      project?.startDate
        ? project.startDate.slice(0, 10)
        : ""
    );

  const [endDate, setEndDate] =
    useState(
      project?.endDate
        ? project.endDate.slice(0, 10)
        : ""
    );

  const [isSaving, setIsSaving] =
    useState(false);

  if (!open) {
    return null;
  }

  const handleCreate = async () => {
    if (!nameAr.trim()) {
      return;
    }

    if (!nameEn.trim()) {
      return;
    }

    if (!serialCode.trim()) {
      return;
    }

    if (
      startDate &&
      endDate &&
      endDate < startDate
    ) {
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        serialCode: serialCode.trim(),
        managerId: null,
        statusId,
        description:
          description.trim() || null,
        startDate:
          startDate || null,
        endDate:
          endDate || null,
      });
    } catch (error) {
      console.error(
        "Failed to create project:",
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!project) {
      return;
    }

    if (!nameAr.trim()) {
      return;
    }

    if (!nameEn.trim()) {
      return;
    }

    if (!serialCode.trim()) {
      return;
    }

    if (
      startDate &&
      endDate &&
      endDate < startDate
    ) {
      return;
    }

    try {
      setIsSaving(true);

      await onUpdate(project.id, {
        nameAr: nameAr.trim(),
        nameEn: nameEn.trim(),
        serialCode: serialCode.trim(),
        managerId:
          project.managerId ?? null,
        statusId,
        description:
          description.trim() || null,
        startDate:
          startDate || null,
        endDate:
          endDate || null,
      });
    } catch (error) {
      console.error(
        "Failed to update project:",
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (isEditMode) {
      await handleUpdate();
      return;
    }

    await handleCreate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {isEditMode
                ? t("editProject")
                : t("addProject")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("modalDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label={t("cancel")}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Arabic Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t("nameAr")}
              </label>

              <Input
                value={nameAr}
                onChange={(event) =>
                  setNameAr(event.target.value)
                }
                placeholder={t(
                  "nameArPlaceholder"
                )}
                size="large"
              />
            </div>

            {/* English Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t("nameEn")}
              </label>

              <Input
                value={nameEn}
                onChange={(event) =>
                  setNameEn(event.target.value)
                }
                placeholder={t(
                  "nameEnPlaceholder"
                )}
                size="large"
              />
            </div>

            {/* Serial Code */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t("serialCode")}
              </label>

              <Input
                value={serialCode}
                onChange={(event) =>
                  setSerialCode(
                    event.target.value
                  )
                }
                placeholder={t(
                  "serialCodePlaceholder"
                )}
                size="large"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t("status")}
              </label>

              <Select
                value={statusId ?? undefined}
                onChange={(value) =>
                  setStatusId(
                    value !== undefined
                      ? Number(value)
                      : null
                  )
                }
                placeholder={t(
                  "statusPlaceholder"
                )}
                options={statuses.map(
                  (status) => ({
                    value: status.id,
                    label: status.name,
                  })
                )}
                allowClear
                size="large"
                className="w-full"
              />
            </div>

            {/* Start Date */}
            <DatePicker
              label={t("fromDate")}
              value={startDate}
              onChange={setStartDate}
              placeholder={t(
                "startDatePlaceholder"
              )}
            />

            {/* End Date */}
            <DatePicker
              label={t("toDate")}
              value={endDate}
              onChange={setEndDate}
              placeholder={t(
                "endDatePlaceholder"
              )}
            />

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t("projectDescription")}
              </label>

              <Input.TextArea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder={t(
                  "descriptionPlaceholder"
                )}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
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
            disabled={isSaving}
            className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-xl bg-[#1470ad] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f5f91] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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

export default ProjectModal;