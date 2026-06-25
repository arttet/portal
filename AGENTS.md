# AGENTS.md — portal

## Project overview

`portal` is a personal startpage and command center built with SvelteKit as a
pure static SPA, deployed to Cloudflare Pages.

- Repository root is the active project root.
- No server-side rendering: `export const prerender = true` in the root layout.
- Build output: `target/build/` with `200.html` fallback for client-side routing.

## Technology stack

- **Framework:** SvelteKit 2 (`@sveltejs/kit`)
- **UI library:** Svelte 5 (runes mode enforced project-wide)
- **Build tool:** Vite 8
- **Language:** TypeScript 6
- **CSS:** Tailwind CSS 4 via `@tailwindcss/vite`
- **Adapter:** `@sveltejs/adapter-static` (static SPA, `fallback: "200.html"`)
- **Package manager:** Bun (lockfile is `bun.lock`)
- **Testing:** Vitest 4 with browser-playwright + Playwright for E2E

## Repository layout

```text
.
├── .github/                # GitHub Actions workflows
├── misc/justfiles/         # just submodules (testing.just)
├── src/
│   ├── app.html            # page shell template
│   ├── app.css             # global styles (@import "tailwindcss")
│   ├── routes/             # file-system routes (+page.svelte, +layout.svelte, …)
│   └── lib/                # shared code, imported as $lib/…
│       └── server/         # server-only code (never import from client)
├── static/                 # static assets copied as-is to build output
├── AGENTS.md               # this file
├── CLAUDE.md               # Claude Code guidance
├── justfile                # task runner (just fmt / lint / build / test)
├── bunfig.toml             # Bun install config (frozenLockfile, isolated linker)
├── package.json            # project manifest
├── playwright.config.ts    # E2E test config (timeout 60 s, output → target/)
├── vite.config.ts          # Vite + SvelteKit + Vitest + Tailwind config
├── svelte.config.js        # adapter-static, runes mode
└── tsconfig.json           # TypeScript config
```

## Commands

Run all commands from the repository root.

```bash
bun install --frozen-lockfile   # install dependencies
bun dev                         # Vite dev server
bun run build                   # production build → target/build
bun run preview                 # serve target/build on :4173 (vite preview)
bun run check                   # svelte-kit sync + svelte-check
bun run test:unit               # Vitest watch
bun run test:unit:coverage      # Vitest with v8 coverage
bun run test:playwright         # Playwright E2E tests
```

`just` (requires just ≥ 1.37) wraps the above:

```bash
just          # fmt + lint + build + test (all)
just fmt      # format
just lint     # all linters
just build    # production build
just dev      # dev server
just preview  # preview server
just test all         # unit + integration + coverage
just test unit        # fast Vitest run
just test integration # Playwright
just test coverage    # Vitest with coverage
```

## CI pipeline

`.github/workflows/ci.yml` defines a four-stage pipeline:

**Stage 1 (parallel gates):**

- `antivirus` — ClamAV filesystem scan
- `fmt` — oxfmt + dprint format checks
- `lint` — actionlint, zizmor, oxlint, svelte-check, stylelint, eslint, knip, markdownlint, cspell
- `security` — dependency review, TruffleHog secret scan, Trivy misconfig scan

**Stage 2 (parallel, needs all Stage 1):**

- `build` — `vite build`, uploads `target/build` artifact
- `unit-chromium` — Vitest with coverage (Chromium)
- `unit-firefox` — Vitest browser tests (Firefox)
- `integration` — Playwright E2E (`bun run test:playwright`)

**Stage 3:**

- `test-reports` — uploads results to Codecov
- `cf-preflight` — checks Cloudflare secrets are present

**Stage 4:**

- `deploy-cf-pages` — `wrangler pages deploy target/build` (skipped if secrets absent or on forks/schedule)

Cloudflare deployment requires: `CLOUDFLARE_API_TOKEN` (secret), `CLOUDFLARE_ACCOUNT_ID` (secret), `CF_PAGES_PROJECT` (variable).

## Testing

**Unit tests** (`vite.config.ts`):

- `client` project — browser-playwright, Chromium/Firefox headless, `src/**/*.svelte.{test,spec}.{js,ts}`
- `server` project — Node environment, `src/**/*.{test,spec}.{js,ts}` (excludes `*.svelte.*`)
- Output: `target/test-results/vitest.junit.xml`, coverage at `target/coverage/`

**E2E tests** (`playwright.config.ts`):

- Files: `**/*.e2e.{ts,js}`
- Timeout: 60 000 ms
- Artifacts: `target/test-results/`, report: `target/playwright-report/`
- WebServer: `bun run build && bun run preview` on port 4173

## Security notes

- No secrets stored in the repository.
- `.gitignore` excludes `.env`, `.env.*`, build outputs, `.svelte-kit`.
- Cloudflare credentials come exclusively from GitHub repository secrets/vars.
- CI runs TruffleHog, Trivy, and ClamAV scans on every push/PR.
