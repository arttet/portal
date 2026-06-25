set dotenv-load
set dotenv-path := ".env"

# ==============================================================================
# Project Settings
# ==============================================================================

build_dir := "target"

export BUILD_DIR := justfile_directory() / build_dir

# ==============================================================================
# Help
# ==============================================================================

[doc('Show help')]
default: help

[doc('List all commands')]
help:
    @just --list --unsorted --list-submodules

# ==============================================================================
# Development
# ==============================================================================

[doc('Install dependencies')]
[group('Development')]
install:
    @echo "📦 Installing dependencies..."
    bun install --frozen-lockfile
    @echo "✅ Dependencies installed!"

[doc('Update dependencies')]
[group('Development')]
update:
    @echo "⬆️  Updating dependencies..."
    bun update -i
    @echo "✅ Dependencies updated!"

[doc('Audit dependencies')]
[group('Development')]
audit:
    @echo "🔍 Auditing dependencies..."
    @bun audit
    @echo "✅ Audit complete!"

[doc('Format code')]
[group('Development')]
fmt:
    @echo "✨ Formatting code..."
    just --fmt
    bunx oxfmt .
    bunx dprint fmt
    @echo "✅ Code formatted!"

[doc('Run linters')]
[group('Development')]
lint:
    bunx --bun oxlint --deny-warnings .
    bunx svelte-kit sync
    bunx svelte-check --tsconfig ./tsconfig.json
    bun run lint:css
    bun run lint:svelte
    bunx knip
    bun run lint:md
    bunx --bun cspell "**/*.{md,mdx,txt,yml,yaml,json,jsonc,toml}" --no-progress

[doc('Build production build')]
[group('Development')]
build:
    @echo "🏗️ Building..."
    bun run build
    @echo "✅ Build complete!"

[doc('Start development server')]
[group('Development')]
dev:
    @echo "🚀 Starting development server..."
    bun dev

[doc('Start production server')]
[group('Development')]
preview:
    @echo "👀 Starting preview server..."
    bun run preview

[doc('Remove build artifacts')]
[group('Development')]
clean:
    @echo "🧹 Cleaning..."
    rm -rf {{ build_dir }} .lighthouseci .svelte-kit node_modules
    @echo "✅ Cleaned!"

# ==============================================================================
# Testing
# ==============================================================================

[group: 'Testing']
mod test 'misc/justfiles/testing.just'

alias tt := test::unit
alias ta := test::all
alias tu := test::unit
alias ti := test::integration
alias tc := test::coverage
