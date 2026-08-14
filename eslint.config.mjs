import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Retired pages and components, kept on disk but out of the repo.
    "_archive/**",
    // The shop is a self-contained sub-app (its own package.json / Vercel
    // project at Root Directory "shop"); keep it out of the website's lint.
    "shop/**",
    // Same for the telecom demo (Root Directory "telecom").
    "telecom/**",
    // Same for the insurance demo (Root Directory "insurance").
    "insurance/**",
    // Same for the Dunder Mifflin paper demo (Root Directory "paper").
    "paper/**",
  ]),
]);

export default eslintConfig;
