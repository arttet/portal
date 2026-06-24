
fmt:
    bunx oxfmt .
    bunx dprint fmt

lint:
    bunx --bun oxlint --deny-warnings .
    bunx svelte-kit sync
    bunx svelte-check --tsconfig ./tsconfig.json
    bun run lint:css
    bun run lint:svelte
    bunx knip
    bun run lint:md
    bunx --bun cspell "**/*.{md,svelte,ts,js}" --no-progress

build:
    bun run build

dev:
    bun dev

preview:
    bun run preview

test:
    bun run test:unit:coverage
