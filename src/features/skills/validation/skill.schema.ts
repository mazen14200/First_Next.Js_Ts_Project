import type { ValidationSchema } from "@/types/validation.types";

export const skillSchema: ValidationSchema = {
  nameAr: {
    rules: [
      { kind: "required" },
      { kind: "type", type: "string" },
      { kind: "script", script: "arabic" },
    ],
  },
  nameEn: {
    rules: [
      { kind: "required" },
      { kind: "type", type: "string" },
      { kind: "script", script: "latin" },
    ],
  },
  description: {
    rules: [
      { kind: "nullable" },
      { kind: "type", type: "string" },
    ],
  },
};
