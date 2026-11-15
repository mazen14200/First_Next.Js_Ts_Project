export type ValidationRule =
  | { kind: "required" }
  | { kind: "type"; type: "string" | "number" | "boolean" }
  | { kind: "min"; value: number }
  | { kind: "max"; value: number }
  | { kind: "step"; value: number | "any" }
  | { kind: "minLength"; value: number }
  | { kind: "maxLength"; value: number }
  | {
      kind: "allowedValues";
      values: readonly (string | number | boolean)[];
    }
  | { kind: "script"; script: "arabic" | "latin" }
  | { kind: "nullable" }
  | {
      kind: "custom";
      validate: (
        value: unknown,
        data: Record<string, unknown>
      ) => string | undefined;
    };

export interface FieldSchema {
  rules: ValidationRule[];
}

export type ValidationSchema = Record<string, FieldSchema>;

export interface ValidationResult {
  valid: boolean;
  fieldErrors: Record<string, string[]>;
}
