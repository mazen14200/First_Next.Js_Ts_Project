"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { CloseOutlined } from "@ant-design/icons";

import { ApiError } from "@/lib/api/api-error";

import type {
  FormField,
  FormModalProps,
  FormValues,
} from "@/components/shared/FormModal/FormModal.types";

const INPUT_CLASSES =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#1470ad] focus:ring-4 focus:ring-[#1470ad]/10 disabled:cursor-not-allowed disabled:bg-slate-50";

function FormModal<TEntity, TPayload>({
  open,
  entity,
  fields,
  toFormValues,
  toPayload,
  onSubmit,
  onClose,
  labels,
}: FormModalProps<TEntity, TPayload>) {
  const idPrefix = useId();

  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(entity ?? null)
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!open) {
    return null;
  }

  const isEditMode = Boolean(entity);

  const setValue = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const hasMissingRequired = fields.some(
    (field) =>
      field.required && !(values[field.name] ?? "").trim()
  );

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};

    for (const field of fields) {
      const value = values[field.name] ?? "";
      const customError = field.validate?.(value, values);

      if (customError && !errors[field.name]) {
        errors[field.name] = customError;
      }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (hasMissingRequired || isSaving) {
      return;
    }

    if (!validateAll()) {
      return;
    }

    setSubmitError(null);
    setIsSaving(true);

    try {
      await onSubmit(toPayload(values));
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Failed to save.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldId = `${idPrefix}-${field.name}`;
    const value = values[field.name] ?? "";
    const error = fieldErrors[field.name];

    const errorText = error ? (
      <p className="mt-1.5 text-xs font-medium text-red-500">
        {error}
      </p>
    ) : null;

    let control: ReactNode;

    switch (field.type) {
      case "textarea":
        control = (
          <textarea
            id={fieldId}
            value={value}
            onChange={(event) =>
              setValue(field.name, event.target.value)
            }
            placeholder={field.placeholder}
            disabled={isSaving}
            rows={field.rows ?? 4}
            maxLength={field.maxLength}
            className={`${INPUT_CLASSES} resize-none`}
          />
        );
        break;

      case "number":
        control = (
          <input
            id={fieldId}
            type="number"
            value={value}
            onChange={(event) =>
              setValue(field.name, event.target.value)
            }
            placeholder={field.placeholder}
            disabled={isSaving}
            min={field.min}
            max={field.max}
            step={field.step}
            className={INPUT_CLASSES}
          />
        );
        break;

      case "select":
        control = (
          <select
            id={fieldId}
            value={value}
            onChange={(event) =>
              setValue(field.name, event.target.value)
            }
            disabled={isSaving}
            className={INPUT_CLASSES}
          >
            {field.placeholder !== undefined && (
              <option value="" disabled>
                {field.placeholder}
              </option>
            )}
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;

      case "custom":
        control = field.render({
          value,
          setValue: (next) => setValue(field.name, next),
          disabled: isSaving,
          error,
          values,
        });
        break;

      default:
        control = (
          <input
            id={fieldId}
            type="text"
            value={value}
            onChange={(event) =>
              setValue(field.name, event.target.value)
            }
            placeholder={field.placeholder}
            disabled={isSaving}
            dir={field.type === "text" ? field.dir : undefined}
            maxLength={
              field.type === "text" ? field.maxLength : undefined
            }
            className={INPUT_CLASSES}
          />
        );
    }

    return (
      <div key={field.name}>
        <label
          htmlFor={fieldId}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {field.label}
          {field.required && (
            <span className="ms-1 text-red-500">*</span>
          )}
        </label>

        {control}
        {errorText}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {isEditMode ? labels.editTitle : labels.createTitle}
            </h2>

            {labels.description && (
              <p className="mt-1 text-sm text-slate-500">
                {labels.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={labels.cancel}
            disabled={isSaving}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 overflow-y-auto px-6 py-6">
          {fields.map(renderField)}

          {submitError && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {submitError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {labels.cancel}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || hasMissingRequired}
            className="cursor-pointer rounded-xl bg-[#1470ad] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12639a] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? labels.saving
              : isEditMode
                ? labels.update
                : labels.submit}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormModal;
