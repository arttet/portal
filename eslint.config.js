import globals from "globals";
import svelte from "eslint-plugin-svelte";
import tsEslint from "typescript-eslint";
import svelteParser from "svelte-eslint-parser";

export default tsEslint.config(
  { ignores: [".svelte-kit/", "node_modules/", "coverage/"] },
  ...svelte.configs["flat/recommended"],
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: { parser: tsEslint.parser },
      globals: { ...globals.browser },
    },
  },
);
