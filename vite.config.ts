import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";

const env = globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};
const browserName = env.process?.env?.VITEST_BROWSER === "firefox" ? "firefox" : "chromium";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    expect: { requireAssertions: true },
    reporters: ["default", "junit"],
    outputFile: { junit: "target/test-results/vitest.junit.xml" },
    coverage: {
      provider: "v8",
      reportsDirectory: "target/coverage",
      reporter: ["text", "lcov"],
    },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "client",
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: browserName, headless: true }],
          },
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          exclude: ["src/lib/server/**"],
        },
      },

      {
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.{test,spec}.{js,ts}"],
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
        },
      },
    ],
  },
});
