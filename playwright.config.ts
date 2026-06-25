import { defineConfig } from "@playwright/test";

export default defineConfig({
  reporter: [
    ["list"],
    ["junit", { outputFile: "target/test-results/playwright.junit.xml" }],
    ["html", { open: "never", outputFolder: "target/playwright-report" }],
  ],
  webServer: { command: "bun run build && bun run preview", port: 4173 },
  testMatch: "**/*.e2e.{ts,js}",
});
