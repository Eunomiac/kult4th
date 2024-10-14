import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const rules = {
  "@typescript-eslint/array-type": [
    "error",
    {
      default: "array-simple",
    }
  ],
  "@typescript-eslint/ban-ts-comment": [
    "error",
    {
      "ts-expect-error": "allow-with-description",
      "ts-ignore": "allow-with-description",
      "ts-nocheck": "allow-with-description",
      "ts-check": "allow-with-description",
      minimumDescriptionLength: 5
    }
  ],
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-namespace": "off",
  "@typescript-eslint/no-non-null-assertion": "off",
  "@typescript-eslint/no-redundant-type-constituents": "off",
  "@typescript-eslint/no-this-alias": [
    "error",
    {
      allowedNames: ["self"]
    }
  ],
  "@typescript-eslint/no-unsafe-argument": "off",
  "@typescript-eslint/no-unsafe-assignment": "off",
  "@typescript-eslint/no-unsafe-call": "off",
  "@typescript-eslint/no-unsafe-declaration-merging": "off",
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/no-unsafe-return": "off",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    {
      args: "none",
      ignoreRestSiblings: true,
    }
  ],
  "@typescript-eslint/restrict-template-expressions": [
    "error",
    {
      allowNumber: true,
      allowBoolean: true
    }
  ],
  "@typescript-eslint/unified-signatures": [
    "error",
    {
      ignoreDifferentlyNamedParameters: true
    }
  ],
  "prefer-const": [
    "error",
    {
      destructuring: "all"
    }
  ]
};

/** === CONFIGURATION === */

const IS_STRICT = false;
const IS_DEVELOPING = true;

/** The various no-unsafe-* rules inevitably cause a proliferation of duplicate
 * alerts that ultimately reflect the same error -- as the erroring value propagates
 * through the codebase, flagging the same error each time it is assessed by the
 * linter.
 *
 * During QA before production, there should be no errors, so we turn this on.
 * During development, where temporary minor errors should not ignite the codebase
 * in a flurry of red errors, we turn this off. */

if (IS_STRICT) {
  rules["@typescript-eslint/no-explicit-any"] = "error";
  rules["@typescript-eslint/no-unsafe-argument"] = "error";
  rules["@typescript-eslint/no-unsafe-assignment"] = "error";
  rules["@typescript-eslint/no-unsafe-call"] = "error";
  rules["@typescript-eslint/no-unsafe-declaration-merging"] = "error";
  rules["@typescript-eslint/no-unsafe-member-access"] = "error";
  rules["@typescript-eslint/no-unsafe-return"] = "error";

  rules["@typescript-eslint/no-unused-vars"] = "error";
}

if (IS_DEVELOPING) {
  rules["@typescript-eslint/no-unused-vars"] = "off";
}


/**
 *
 *
 *   */

export default tseslint.config(
  {
    // config with just ignores is the replacement for '.eslintignore'
    ignores: [
      "**/.vscode/**",
      "**/dist/**",
      "**/*.test.ts"
    ]
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.d.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules
  }
);