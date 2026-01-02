# AGENTS.md

## Commands
- **Build**: `pnpm build` (Next.js production build)
- **Dev**: `pnpm dev` (start dev server)
- **Lint**: `pnpm lint` (Next.js ESLint)
- **Lint Biome**: `pnpm lint:biome` (Biome linting)
- **Format**: `pnpm format` (Biome auto-format)
- **Format Check**: `pnpm format:check` (Check formatting)
- **Test**: `pnpm test` (Vitest)
- **Test run**: `pnpm test:run` (Run all tests once)

## Code Style Guidelines
- **Language**: TypeScript with React/Next.js
- **Imports**: Absolute paths with `@/` alias (e.g., `import { Component } from '@/components'`)
- **Naming**: PascalCase for components/classes, camelCase for variables/functions, UPPER_CASE for constants
- **Formatting**: Consistent indentation (2 spaces), semicolons, single quotes
- **Types**: Explicit types for props, return values; avoid `any`; use interfaces for objects
- **Error Handling**: Use try-catch for async ops; throw Error objects; handle promises with .catch()
- **Components**: Functional with hooks; prefer early returns; avoid excessive nesting; use meaningful className and HTML semantic elements
- **State Management**: Use React.Context for global state
- **SCSS**: Use partials in `/styles`; import via `globals.scss`; BEM or similar naming
- **Commits**: Imperative mood, <50 chars; reference issues if applicable</content>
<parameter name="filePath">/home/majid/OpenWorks/salamat-jost/AGENTS.md