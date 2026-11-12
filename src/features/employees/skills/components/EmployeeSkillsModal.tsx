"use client";

import { useState } from "react";
import { Modal } from "antd";
import { useLocale, useTranslations } from "next-intl";

import type {
  EmployeeSkill,
  CreateEmployeeSkillRequest,
  UpdateEmployeeSkillRequest,
} from "@/features/employees/skills";

interface SkillOption {
  id: number;
  nameAr: string;
  nameEn: string;
}

interface SkillLevelOption {
  id: number;
  nameAr: string;
  nameEn: string;
  rank: number;
}

interface EmployeeSkillsModalProps {
  open: boolean;
  employeeSkill: EmployeeSkill | null;
  skills: SkillOption[];
  skillLevels: SkillLevelOption[];
  onClose: () => void;
  onSubmit: (
    data: CreateEmployeeSkillRequest
  ) => Promise<void>;
  onUpdate: (
    skillId: number,
    data: UpdateEmployeeSkillRequest
  ) => Promise<void>;
}

const EmployeeSkillsModal = ({
  open,
  employeeSkill,
  skills,
  skillLevels,
  onClose,
  onSubmit,
  onUpdate,
}: EmployeeSkillsModalProps) => {
  const locale = useLocale();
  const t = useTranslations("employeeSkills");

  const isEditMode = Boolean(employeeSkill);

  const [skillId, setSkillId] = useState(
    employeeSkill?.skillId
      ? String(employeeSkill.skillId)
      : ""
  );

  const [skillLevelId, setSkillLevelId] =
    useState(
      employeeSkill?.skillLevelId
        ? String(employeeSkill.skillLevelId)
        : ""
    );

  const [submitting, setSubmitting] =
    useState(false);

  const handleSubmit = async () => {
    if (!skillLevelId) {
      return;
    }

    if (!isEditMode && !skillId) {
      return;
    }

    setSubmitting(true);

    try {
      if (isEditMode && employeeSkill) {
        await onUpdate(
          employeeSkill.skillId,
          {
            skillLevelId: Number(
              skillLevelId
            ),
          }
        );
      } else {
        await onSubmit({
          skillId: Number(skillId),
          skillLevelId: Number(
            skillLevelId
          ),
        });
      }

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        isEditMode
          ? t("editTitle")
          : t("addTitle")
      }
      onCancel={onClose}
      onOk={handleSubmit}
      okText={
        isEditMode
          ? t("save")
          : t("add")
      }
      cancelText={t("cancel")}
      confirmLoading={submitting}
      destroyOnHidden
    >
      <div className="space-y-5 py-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {t("skill")}
          </label>

          <select
            value={skillId}
            onChange={(event) =>
              setSkillId(event.target.value)
            }
            disabled={isEditMode}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#1470ad] focus:ring-2 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">
              {t("selectSkill")}
            </option>

            {skills.map((skill) => (
              <option
                key={skill.id}
                value={skill.id}
              >
                {locale === "ar"
                  ? skill.nameAr
                  : skill.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {t("skillLevel")}
          </label>

          <select
            value={skillLevelId}
            onChange={(event) =>
              setSkillLevelId(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#1470ad] focus:ring-2 focus:ring-[#1470ad]/10"
          >
            <option value="">
              {t("selectSkillLevel")}
            </option>

            {skillLevels.map(
              (level) => (
                <option
                  key={level.id}
                  value={level.id}
                >
                  {locale === "ar"
                    ? level.nameAr
                    : level.nameEn}
                </option>
              )
            )}
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeSkillsModal;