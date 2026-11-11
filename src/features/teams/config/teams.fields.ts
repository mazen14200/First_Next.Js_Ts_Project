import type {
  FormField,
  FormValues,
} from "../../../components/shared";

import type {
  CreateTeamRequest,
  Team,
  UpdateTeamRequest,
} from "../types/team.types";

export interface TeamFieldLabels {
  nameAR: string;
  nameARPlaceholder: string;
  nameEN: string;
  nameENPlaceholder: string;
  rate: string;
  ratePlaceholder: string;
}

export function teamFields(
  labels: TeamFieldLabels
): FormField[] {
  return [
    {
      type: "text",
      name: "nameAR",
      label: labels.nameAR,
      placeholder: labels.nameARPlaceholder,
      required: true,
      dir: "rtl",
    },
    {
      type: "text",
      name: "nameEN",
      label: labels.nameEN,
      placeholder: labels.nameENPlaceholder,
      required: true,
    },
    {
      type: "number",
      name: "rate",
      label: labels.rate,
      placeholder: labels.ratePlaceholder,
      required: true,
      min: 0,
      step: "any",
    },
  ];
}

export function toTeamFormValues(
  entity?: Team | null
): FormValues {
  return {
    nameAR: entity?.nameAR ?? "",
    nameEN: entity?.nameEN ?? "",
    rate:
      entity?.rate !== undefined && entity?.rate !== null
        ? String(entity.rate)
        : "",
  };
}

export function toTeamPayload(
  values: FormValues
): CreateTeamRequest | UpdateTeamRequest {
  return {
    nameAR: values.nameAR.trim(),
    nameEN: values.nameEN.trim(),
    rate: Number(values.rate),
  };
}
