import type { ValidationSchema } from "@/types/validation.types";

export const teamSchema: ValidationSchema = {
  nameAR: {
    rules: [
      { kind: "required" },
      { kind: "type", type: "string" },
      { kind: "script", script: "arabic" },
    ],
  },
  nameEN: {
    rules: [
      { kind: "required" },
      { kind: "type", type: "string" },
      { kind: "script", script: "latin" },
    ],
  },
  rate: {
    rules: [
      { kind: "required" },
      { kind: "type", type: "number" },
      { kind: "min", value: 0 },
      { kind: "step", value: "any" },
    ],
  },
};
