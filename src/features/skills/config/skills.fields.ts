import type {
  FormField,
  FormValues,
} from "@/components/shared";

import type {
  CreateSkillRequest,
  Skill,
  UpdateSkillRequest,
} from "@/features/skills/types/skills.types";

export interface SkillFieldLabels {
  arabicName: string;
  nameArPlaceholder: string;
  englishName: string;
  nameEnPlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
}

export function skillFields(
  labels: SkillFieldLabels
): FormField[] {
  return [
    {
      type: "text",
      name: "nameAr",
      label: labels.arabicName,
      placeholder: labels.nameArPlaceholder,
      required: true,
      dir: "rtl",
    },
    {
      type: "text",
      name: "nameEn",
      label: labels.englishName,
      placeholder: labels.nameEnPlaceholder,
      required: true,
    },
    {
      type: "textarea",
      name: "description",
      label: labels.descriptionLabel,
      placeholder: labels.descriptionPlaceholder,
      required: false,
      rows: 4,
    },
  ];
}

export function toSkillFormValues(
  entity?: Skill | null
): FormValues {
  return {
    nameAr: entity?.nameAr ?? "",
    nameEn: entity?.nameEn ?? "",
    description: entity?.description ?? "",
  };
}

export function toSkillPayload(
  values: FormValues
): CreateSkillRequest | UpdateSkillRequest {
  return {
    nameAr: values.nameAr.trim(),
    nameEn: values.nameEn.trim(),
    description: values.description.trim() || null,
  };
}
