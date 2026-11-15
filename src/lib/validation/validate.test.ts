import { describe, expect, it } from "vitest";

import { validate } from "./validate";
import { teamSchema } from "@/features/teams/validation/team.schema";
import { skillSchema } from "@/features/skills/validation/skill.schema";
import type { ValidationSchema } from "@/types/validation.types";

const stringSchema: ValidationSchema = {
  name: {
    rules: [
      { kind: "required" },
      { kind: "type", type: "string" },
      { kind: "maxLength", value: 5 },
    ],
  },
};

const numberSchema: ValidationSchema = {
  rate: {
    rules: [
      { kind: "required" },
      { kind: "type", type: "number" },
      { kind: "min", value: 0 },
      { kind: "step", value: "any" },
    ],
  },
};

describe("validate", () => {
  it("rejects empty required text", () => {
    const result = validate({ name: "" }, stringSchema);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.name).toContain("REQUIRED");
  });

  it("rejects whitespace-only required text", () => {
    const result = validate({ name: "   " }, stringSchema);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors.name).toContain("REQUIRED");
  });

  it("accepts valid text", () => {
    const result = validate({ name: "abc" }, stringSchema);
    expect(result.valid).toBe(true);
  });

  it("rejects text over maxLength", () => {
    const result = validate({ name: "abcdef" }, stringSchema);
    expect(result.fieldErrors.name).toContain("MAX_LENGTH");
  });

  it("rejects non-string type", () => {
    const result = validate({ name: 123 }, stringSchema);
    expect(result.fieldErrors.name).toContain("INVALID_TYPE");
  });

  it("accepts numeric string for number fields", () => {
    const result = validate({ rate: "12.5" }, numberSchema);
    expect(result.valid).toBe(true);
  });

  it("accepts decimal numbers with step any", () => {
    const result = validate({ rate: 0.5 }, numberSchema);
    expect(result.valid).toBe(true);
  });

  it("rejects zero boundary correctly (min 0 allows 0)", () => {
    const result = validate({ rate: 0 }, numberSchema);
    expect(result.valid).toBe(true);
  });

  it("rejects negative numbers", () => {
    const result = validate({ rate: -1 }, numberSchema);
    expect(result.fieldErrors.rate).toContain("MIN_VALUE");
  });

  it("rejects non-numeric rate", () => {
    const result = validate({ rate: "abc" }, numberSchema);
    expect(result.fieldErrors.rate).toContain("INVALID_NUMBER");
  });

  it("rejects NaN and Infinity", () => {
    expect(
      validate({ rate: NaN }, numberSchema).fieldErrors.rate
    ).toContain("INVALID_NUMBER");
    expect(
      validate({ rate: Infinity }, numberSchema).fieldErrors.rate
    ).toContain("INVALID_NUMBER");
  });

  it("rejects empty required number", () => {
    const result = validate({ rate: "" }, numberSchema);
    expect(result.fieldErrors.rate).toContain("REQUIRED");
  });

  it("allows optional empty field", () => {
    const optional: ValidationSchema = {
      desc: {
        rules: [
          { kind: "nullable" },
          { kind: "type", type: "string" },
        ],
      },
    };
    expect(validate({ desc: "" }, optional).valid).toBe(true);
    expect(validate({}, optional).valid).toBe(true);
    expect(validate({ desc: null }, optional).valid).toBe(true);
    expect(
      validate({ desc: 5 }, optional).fieldErrors.desc
    ).toContain("INVALID_TYPE");
  });

  it("enforces allowedValues loosely for query strings", () => {
    const filter: ValidationSchema = {
      isActive: {
        rules: [
          {
            kind: "allowedValues",
            values: [true, false],
          },
        ],
      },
    };
    expect(validate({ isActive: "true" }, filter).valid).toBe(true);
    expect(validate({ isActive: "abc" }, filter).valid).toBe(false);
  });

  it("supports custom rules", () => {
    const custom: ValidationSchema = {
      code: {
        rules: [
          {
            kind: "custom",
            validate: (v) =>
              v === "bad" ? "CUSTOM_FAIL" : undefined,
          },
        ],
      },
    };
    expect(
      validate({ code: "bad" }, custom).fieldErrors.code
    ).toContain("CUSTOM_FAIL");
    expect(validate({ code: "ok" }, custom).valid).toBe(true);
  });
});

describe("script rule", () => {
  const scriptSchema: ValidationSchema = {
    arName: {
      rules: [
        { kind: "required" },
        { kind: "type", type: "string" },
        { kind: "script", script: "arabic" },
      ],
    },
    enName: {
      rules: [
        { kind: "required" },
        { kind: "type", type: "string" },
        { kind: "script", script: "latin" },
      ],
    },
  };

  it("accepts Arabic letters, digits and symbols in arabic field", () => {
    const result = validate(
      { arName: "فريق 123 -!", enName: "Team 1!" },
      scriptSchema
    );
    expect(result.fieldErrors.arName).toBeUndefined();
    expect(result.valid).toBe(true);
  });

  it("rejects Latin letters in arabic field", () => {
    const result = validate(
      { arName: "فريق Test", enName: "Team" },
      scriptSchema
    );
    expect(result.fieldErrors.arName).toContain("ARABIC_SCRIPT");
  });

  it("rejects Arabic letters in latin field", () => {
    const result = validate(
      { arName: "فريق", enName: "Team فريق" },
      scriptSchema
    );
    expect(result.fieldErrors.enName).toContain("LATIN_SCRIPT");
  });

  it("allows digits and punctuation in both fields", () => {
    const result = validate(
      { arName: "فريق-2024", enName: "Team_2024!" },
      scriptSchema
    );
    expect(result.valid).toBe(true);
  });
});

describe("teamSchema", () => {
  const validDto = {
    nameAR: "فريق",
    nameEN: "Team",
    rate: 10,
  };

  it("accepts valid team DTO", () => {
    expect(validate(validDto, teamSchema).valid).toBe(true);
  });

  it("accepts form string values", () => {
    expect(
      validate(
        { nameAR: "فريق", nameEN: "Team", rate: "10.5" },
        teamSchema
      ).valid
    ).toBe(true);
  });

  it("rejects missing names", () => {
    const result = validate(
      { nameAR: "", nameEN: "Team", rate: 1 },
      teamSchema
    );
    expect(result.fieldErrors.nameAR).toContain("REQUIRED");
  });

  it("rejects negative rate", () => {
    const result = validate(
      { ...validDto, rate: -5 },
      teamSchema
    );
    expect(result.fieldErrors.rate).toContain("MIN_VALUE");
  });
});

describe("skillSchema", () => {
  it("accepts skill with null description", () => {
    expect(
      validate(
        { nameAr: "مهارة", nameEn: "Skill", description: null },
        skillSchema
      ).valid
    ).toBe(true);
  });

  it("accepts skill with empty description", () => {
    expect(
      validate(
        { nameAr: "مهارة", nameEn: "Skill", description: "" },
        skillSchema
      ).valid
    ).toBe(true);
  });

  it("rejects missing names", () => {
    const result = validate(
      { nameAr: "", nameEn: "", description: null },
      skillSchema
    );
    expect(result.fieldErrors.nameAr).toContain("REQUIRED");
    expect(result.fieldErrors.nameEn).toContain("REQUIRED");
  });
});
