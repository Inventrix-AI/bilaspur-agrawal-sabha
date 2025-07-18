import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow any type for now - you can gradually fix these
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Allow require imports for now
      "@typescript-eslint/no-require-imports": "warn",
      
      // Allow unused variables as warnings
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Allow img tags for now
      "@next/next/no-img-element": "warn",
      
      // Allow HTML links for now
      "@next/next/no-html-link-for-pages": "warn",
      
      // Allow missing dependencies in useEffect
      "react-hooks/exhaustive-deps": "warn",
      
      // Allow unescaped entities for now
      "react/no-unescaped-entities": "warn"
    }
  }
];

export default eslintConfig;