# Security Policy

## Reporting a Vulnerability

Please report vulnerabilities via [GitHub Security Advisories](https://github.com/arttet/portal/security/advisories/new).
Do not open public issues for security findings.

Expected response: acknowledgment within 72 hours, fix timeline communicated within 7 days.

## Scope

- `src/` — application source code
- `.github/workflows/` — CI/CD pipeline
- `static/_headers` — HTTP security headers served via Cloudflare Pages

Out of scope: third-party dependencies (report to their maintainers), GitHub infrastructure.

## Dependency Overrides

`package.json` `overrides` and `patchedDependencies` pin specific transitive dependency versions for security reasons.
These are intentional and reviewed — not accidental pins.

| Override                         | Reason                                                                                                                                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cookie@0.7.2`                   | Fixes cookie-signature timing-attack vulnerability in transitive dep                                                                                                                           |
| `js-yaml@4.2.0`                  | Pins to patched version; fixes prototype-pollution in older releases                                                                                                                           |
| `markdown-it@14.2.0`             | Fixes ReDoS in older versions                                                                                                                                                                  |
| `markdownlint-cli2@0.22.1` patch | ESM namespace import fix for `js-yaml` — `import yaml from "js-yaml"` → `import * as yaml from "js-yaml"`; needed because `js-yaml` v4 ships CJS only and does not expose a default ESM export |

## Security Controls

- **CI Stage 1:** TruffleHog secret scan, Trivy vulnerability/misconfiguration scan, ClamAV antivirus scan, Semgrep SAST (`ci --oss-only`), CodeQL (`javascript-typescript`) run in parallel before any build
- **Dependency audit:** GitHub Dependency Review on every pull request
- **Supply chain:** All GitHub Actions pinned to SHA; `bunfig.toml` enforces `frozenLockfile = true` and `ignoreScripts = true`
- **Build attestation:** Sigstore provenance (`actions/attest-build-provenance`) and SBOM (`anchore/sbom-action` → `actions/attest`) on every non-PR build; attestation job runs without project source code in scope
- **HTTP headers:** HSTS (2 years, preload), CSP, COOP, CORP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
- **Harden-runner:** `egress-policy: block` with per-job allowlists on all CI jobs via `step-security/harden-runner`
