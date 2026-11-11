import type { ReactNode } from "react";

export type FormValues = Record<string, string>;

interface BaseField {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validate?: (
    value: string,
    values: FormValues
  ) => string | undefined;
}

export interface TextField extends BaseField {
  type: "text";
  dir?: "rtl" | "ltr";
  maxLength?: number;
}

export interface NumberField extends BaseField {
  type: "number";
  min?: number;
  max?: number;
  step?: number | string;
}

export interface TextareaField extends BaseField {
  type: "textarea";
  rows?: number;
  maxLength?: number;
}

export interface SelectField extends BaseField {
  type: "select";
  options: { value: string; label: string }[];
}

export interface CustomField extends BaseField {
  type: "custom";
  render: (ctx: {
    value: string;
    setValue: (value: string) => void;
    disabled: boolean;
    error?: string;
    values: FormValues;
  }) => ReactNode;
}

export type FormField =
  | TextField
  | NumberField
  | TextareaField
  | SelectField
  | CustomField;

export interface FormModalLabels {
  createTitle: string;
  editTitle: string;
  description?: string;
  submit: string;
  update: string;
  cancel: string;
  saving: string;
}

export interface FormModalProps<TEntity, TPayload> {
  open: boolean;
  entity?: TEntity | null;
  fields: FormField[];
  toFormValues: (entity?: TEntity | null) => FormValues;
  toPayload: (values: FormValues) => TPayload;
  onSubmit: (payload: TPayload) => Promise<void>;
  onClose: () => void;
  labels: FormModalLabels;
}
